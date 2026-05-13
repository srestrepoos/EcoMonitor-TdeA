/***************************************************************
   ESP32 + ZMPT101B + SCT-013 (50A/1V)
   WiFi + Supabase REST API
****************************************************************/

#include <math.h>
#include <WiFi.h>
#include <HTTPClient.h>

/* ======= WiFi ======= */
const char* WIFI_SSID     = "SASA";
const char* WIFI_PASSWORD = "1035854625";

/* ======= Supabase ======= */
const char* SUPABASE_URL         = "https://zrrtoasbescwvlesrvfk.supabase.co";
const char* SUPABASE_SERVICE_KEY = "TU_SERVICE_ROLE_KEY_AQUI"; // Reemplazar con tu service_role key

/* ======= Pines de hardware ======= */
const int PIN_V_ADC = 34;   // ZMPT101B OUT
const int PIN_I_ADC = 32;   // SCT-013 50A/1V

/* ======= ADC / Calibración ======= */
const float V_REF   = 3.3;
const int   ADC_RES = 4095;

const float V_GAIN  = 230.0 / 0.5;  // 0.5 Vrms -> 230 V
const float I_GAIN  = 50.0  / 1.0;  // SCT-013 50A/1V -> 1 Vrms = 50 A

/* ======= Variables de medida ======= */
float Vrms      = 0;
float Irms      = 0;
float Power     = 0;
float Energy_Wh = 0;

unsigned long lastEnergyMillis = 0;
unsigned long lastSendMillis   = 0;
const unsigned long INTERVAL   = 5000; // ms

/* ======= Medir V e I (RMS por muestras) ======= */
void measureVI() {
  const int N_SAMPLES = 1000;

  double sumV = 0, sumV2 = 0;
  double sumI = 0, sumI2 = 0;

  for (int i = 0; i < N_SAMPLES; i++) {
    int rawV = analogRead(PIN_V_ADC);
    int rawI = analogRead(PIN_I_ADC);

    float v  = (rawV * V_REF) / ADC_RES;
    float ic = (rawI * V_REF) / ADC_RES;

    sumV  += v;
    sumV2 += (double)v * v;
    sumI  += ic;
    sumI2 += (double)ic * ic;

    delayMicroseconds(500);
  }

  double meanV  = sumV  / N_SAMPLES;
  double meanV2 = sumV2 / N_SAMPLES;
  double meanI  = sumI  / N_SAMPLES;
  double meanI2 = sumI2 / N_SAMPLES;

  double varV = meanV2 - meanV * meanV;
  double varI = meanI2 - meanI * meanI;

  if (varV < 0) varV = 0;
  if (varI < 0) varI = 0;

  Vrms  = sqrt(varV) * V_GAIN;
  Irms  = sqrt(varI) * I_GAIN;
  Power = Vrms * Irms;
}

/* ======= Enviar lectura a Supabase ======= */
void sendToSupabase() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[Supabase] Sin WiFi — omitiendo envio");
    return;
  }

  HTTPClient http;
  String endpoint = String(SUPABASE_URL) + "/rest/v1/readings";
  http.begin(endpoint);

  http.addHeader("Content-Type",  "application/json");
  http.addHeader("apikey",        SUPABASE_SERVICE_KEY);
  http.addHeader("Authorization", String("Bearer ") + SUPABASE_SERVICE_KEY);
  http.addHeader("Prefer",        "return=minimal");

  char body[128];
  snprintf(body, sizeof(body),
    "{\"voltage\":%.2f,\"current\":%.2f,\"power\":%.2f,\"energy_wh\":%.4f}",
    Vrms, Irms, Power, Energy_Wh
  );

  int code = http.POST(body);
  if (code > 0) {
    Serial.print("[Supabase] HTTP "); Serial.println(code);
  } else {
    Serial.print("[Supabase] Error: "); Serial.println(http.errorToString(code));
  }
  http.end();
}

/* ======= Logica principal ======= */
void sendData() {
  measureVI();

  // Integrar energia (Wh)
  unsigned long now = millis();
  if (lastEnergyMillis == 0) lastEnergyMillis = now;
  float dt_h = (now - lastEnergyMillis) / 3600000.0;
  lastEnergyMillis = now;
  Energy_Wh += Power * dt_h;

  // Imprimir en monitor serial
  Serial.println("--------------------------------------------------");
  Serial.print("Voltaje  : "); Serial.print(Vrms,      2); Serial.println(" V");
  Serial.print("Corriente: "); Serial.print(Irms,      2); Serial.println(" A");
  Serial.print("Potencia : "); Serial.print(Power,     2); Serial.println(" W");
  Serial.print("Energia  : "); Serial.print(Energy_Wh, 2); Serial.println(" Wh");

  // Enviar a Supabase
  sendToSupabase();
}

/* ======= Setup ======= */
void setup() {
  Serial.begin(115200);
  Serial.println("EcoMonitor iniciado");

  // Conectar WiFi
  Serial.print("[WiFi] Conectando a ");
  Serial.println(WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int intentos = 0;
  while (WiFi.status() != WL_CONNECTED && intentos < 20) {
    delay(500);
    Serial.print(".");
    intentos++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.print("[WiFi] Conectado. IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println();
    Serial.println("[WiFi] No se pudo conectar — continuando sin red");
  }
}

/* ======= Loop ======= */
void loop() {
  unsigned long now = millis();
  if (now - lastSendMillis >= INTERVAL) {
    lastSendMillis = now;
    sendData();
  }
}
