/***************************************************************
 * EcoMonitor TdeA — ESP32 + ZMPT101B + SCT-013 + DHT11
 * Semillero Agil Project — RedCOLSI 2026
 *
 * Envio de datos a:
 *   - Blynk IoT  (mantener)
 *   - ThingSpeak (mantener)
 *   - Supabase   (NUEVO)
 *
 * Blynk virtual pins:
 *   V0 = Voltaje (V)    V1 = Corriente (A)
 *   V2 = Potencia (W)   V3 = Energia (Wh)
 *   V4 = Temperatura    V5 = Humedad (%)
 ***************************************************************/

/* ======= Blynk ======= */
#define BLYNK_TEMPLATE_ID   "TMPL2Ab9IMVPV"
#define BLYNK_TEMPLATE_NAME "Aldair monitor"
#define BLYNK_AUTH_TOKEN    "y6hBhgWltZ2WVjDyWZ-c0D8i7e5LL1Ps"
#define BLYNK_PRINT Serial

#include <WiFi.h>
#include <HTTPClient.h>
#include <BlynkSimpleEsp32.h>
#include <DHT.h>
#include <math.h>

/* ======= WiFi ======= */
const char* WIFI_SSID = "PICACHITO_ARTES";
const char* WIFI_PASS = "26298675";

/* ======= ThingSpeak ======= */
const char* TS_SERVER  = "http://api.thingspeak.com";
const char* TS_API_KEY = "HYE4OJY19Q7RWIV9";

/* ======= Supabase ======= */
// IMPORTANTE: esta service_role key SOLO va en el firmware del ESP32,
// NUNCA en el dashboard web ni en la app Android (esos usan anon key).
const char* SUPABASE_URL = "https://zrrtoasbescwvlesrvfk.supabase.co";
const char* SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpycnRvYXNiZXNjd3ZsZXNydmZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mzk0Mzc5MSwiZXhwIjoyMDg5NTE5NzkxfQ.QK2D_C6UjYNFThrPM1IQFJuUjuCUVjs8v_IyGM2ezdk";

/* ======= Hardware ======= */
const int PIN_V_ADC  = 34;   // ZMPT101B OUT
const int PIN_I_ADC  = 32;   // SCT-013 50A/1V
const int LED_PIN    = 26;   // LED alarma
const int BUZZER_PIN = 25;   // Buzzer alarma
#define   DHTPIN       14    // DHT11 DATA
#define   DHTTYPE      DHT11

/* ======= Calibracion ADC ======= */
const float V_REF   = 3.3f;
const int   ADC_RES = 4095;
const float V_GAIN  = 230.0f / 0.5f;  // 0.5 Vrms -> 230 V
const float I_GAIN  = 50.0f  / 1.0f;  // SCT-013 50A/1V: 1 Vrms = 50 A

/* ======= Umbral de alarma ======= */
const float POWER_ALERT_W = 50.0f;  // vatios — ajustar segun necesidad

/* ======= Objetos ======= */
DHT dht(DHTPIN, DHTTYPE);
BlynkTimer timer;

/* ======= Variables de medida ======= */
float Vrms     = 0.0f;
float Irms     = 0.0f;
float Power    = 0.0f;
float Energy_Wh = 0.0f;
unsigned long lastEnergyMillis = 0;

/* -----------------------------------------------------------
 * Medir Vrms e Irms por muestreo (1000 muestras)
 * --------------------------------------------------------- */
void measureVI() {
  const int N = 1000;
  double sumV = 0, sumV2 = 0;
  double sumI = 0, sumI2 = 0;

  for (int n = 0; n < N; n++) {
    float v = (analogRead(PIN_V_ADC) * V_REF) / ADC_RES;
    float i = (analogRead(PIN_I_ADC) * V_REF) / ADC_RES;
    sumV  += v;   sumV2 += (double)v * v;
    sumI  += i;   sumI2 += (double)i * i;
    delayMicroseconds(500);
  }

  double varV = (sumV2 / N) - (sumV / N) * (sumV / N);
  double varI = (sumI2 / N) - (sumI / N) * (sumI / N);
  if (varV < 0) varV = 0;
  if (varI < 0) varI = 0;

  Vrms  = sqrt(varV) * V_GAIN;
  Irms  = sqrt(varI) * I_GAIN;
  Power = Vrms * Irms;
}

/* -----------------------------------------------------------
 * Leer DHT11 — devuelve -100/-1 si el sensor falla
 * --------------------------------------------------------- */
void readDHT(float &temp, float &hum) {
  temp = dht.readTemperature();
  hum  = dht.readHumidity();
  if (isnan(temp) || isnan(hum)) { temp = -100.0f; hum = -1.0f; }
}

/* -----------------------------------------------------------
 * Enviar a ThingSpeak (GET)
 * --------------------------------------------------------- */
void sendToThingSpeak(float v, float i, float p, float e, float t, float h) {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  String url = String(TS_SERVER) + "/update?api_key=" + TS_API_KEY +
               "&field1=" + String(v, 2) + "&field2=" + String(i, 2) +
               "&field3=" + String(p, 2) + "&field4=" + String(e, 2) +
               "&field5=" + String(t, 1) + "&field6=" + String(h, 1);
  http.begin(url);
  int code = http.GET();
  http.end();
  Serial.print("ThingSpeak HTTP: "); Serial.println(code);
}

/* -----------------------------------------------------------
 * Enviar a Supabase (POST /rest/v1/readings)
 * Usa service_role key para insertar sin autenticacion de usuario.
 * La columna alert refleja si la potencia supera el umbral.
 * temperature/humidity se envian como null si el DHT falla.
 * --------------------------------------------------------- */
void sendToSupabase(float v, float i, float p, float e, float t, float h) {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  http.begin(String(SUPABASE_URL) + "/rest/v1/readings");
  http.setTimeout(8000);
  http.addHeader("Content-Type",  "application/json");
  http.addHeader("apikey",        SUPABASE_KEY);
  http.addHeader("Authorization", String("Bearer ") + SUPABASE_KEY);
  http.addHeader("Prefer",        "return=minimal");

  // Construir JSON; enviar null si el DHT reporto error
  String tempVal = (t <= -99.0f) ? "null" : String(t, 1);
  String humVal  = (h < 0.0f)    ? "null" : String(h, 1);

  String payload = "{";
  payload += "\"voltage\":"    + String(v, 2)                      + ",";
  payload += "\"current_a\":" + String(i, 2)                      + ",";
  payload += "\"power_w\":"   + String(p, 2)                      + ",";
  payload += "\"energy_wh\":" + String(e, 2)                      + ",";
  payload += "\"temperature\":" + tempVal                           + ",";
  payload += "\"humidity\":"    + humVal                            + ",";
  payload += "\"alert\":"       + (p > POWER_ALERT_W ? "true" : "false") + ",";
  payload += "\"location\":\"Aula principal\"";
  payload += "}";

  int code = http.POST(payload);
  http.end();
  Serial.print("Supabase HTTP: "); Serial.println(code);
}

/* -----------------------------------------------------------
 * Tarea principal — ejecutada cada 5 s por BlynkTimer
 * --------------------------------------------------------- */
void sendData() {
  measureVI();

  float temp, hum;
  readDHT(temp, hum);

  // Integracion de energia (Wh)
  unsigned long now = millis();
  if (lastEnergyMillis == 0) lastEnergyMillis = now;
  Energy_Wh += Power * ((now - lastEnergyMillis) / 3600000.0f);
  lastEnergyMillis = now;

  // Debug serie
  Serial.printf("V=%.2fV  I=%.2fA  P=%.2fW  E=%.3fWh  T=%.1fC  H=%.1f%%\n",
                Vrms, Irms, Power, Energy_Wh, temp, hum);

  // Blynk
  Blynk.virtualWrite(V0, Vrms);
  Blynk.virtualWrite(V1, Irms);
  Blynk.virtualWrite(V2, Power);
  Blynk.virtualWrite(V3, Energy_Wh);
  Blynk.virtualWrite(V4, temp);
  Blynk.virtualWrite(V5, hum);

  // ThingSpeak
  sendToThingSpeak(Vrms, Irms, Power, Energy_Wh, temp, hum);

  // Supabase (NUEVO)
  sendToSupabase(Vrms, Irms, Power, Energy_Wh, temp, hum);

  // Alarma local (LED + Buzzer)
  bool alert = (Power > POWER_ALERT_W);
  digitalWrite(LED_PIN,    alert ? HIGH : LOW);
  digitalWrite(BUZZER_PIN, alert ? HIGH : LOW);
}

/* -----------------------------------------------------------
 * Setup
 * --------------------------------------------------------- */
void setup() {
  Serial.begin(115200);

  pinMode(LED_PIN,    OUTPUT); digitalWrite(LED_PIN,    LOW);
  pinMode(BUZZER_PIN, OUTPUT); digitalWrite(BUZZER_PIN, LOW);

  dht.begin();

  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("Conectando a WiFi");
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println("\nWiFi conectado — IP: " + WiFi.localIP().toString());

  Blynk.begin(BLYNK_AUTH_TOKEN, WIFI_SSID, WIFI_PASS);

  timer.setInterval(5000L, sendData);
}

/* -----------------------------------------------------------
 * Loop
 * --------------------------------------------------------- */
void loop() {
  Blynk.run();
  timer.run();
}
