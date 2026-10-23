// 03 — Calibrate the LDR in your own room
// Hardware unit, section B7 (calibration). Board: Arduino Uno R3 (5 V).
// Same wiring as 01_light_indicator_basic (the LED is not used).
//
// How to use:
//   1. Upload, then open the Serial Monitor at 9600 baud.
//   2. For about 10 seconds, cover the LDR with your hand (dark),
//      then uncover it or shine a light on it (bright).
//   3. Copy the suggested thresholds into 02_light_indicator_smoothed.
//   4. Record the min/max readings in the project log.
//
// Status: not yet tested on real hardware.

const int sensorPin = A0;

int minReading = 1023;  // start high so the first reading replaces it
int maxReading = 0;     // start low so the first reading replaces it

void setup() {
  Serial.begin(9600);
  Serial.println("Cover and uncover the LDR to record dark and bright readings.");
}

void loop() {
  int reading = analogRead(sensorPin);

  if (reading < minReading) minReading = reading;
  if (reading > maxReading) maxReading = reading;

  // Put the thresholds near the middle, with a gap between them (hysteresis).
  int range = maxReading - minReading;
  int middle = minReading + range / 2;
  int gap = range / 10;  // 10 % of the range

  Serial.print("now: ");
  Serial.print(reading);
  Serial.print("  bright (min): ");
  Serial.print(minReading);
  Serial.print("  dark (max): ");
  Serial.print(maxReading);

  if (range < 100) {
    Serial.println("  -> range too small, make it darker/brighter");
  } else {
    Serial.print("  -> onThreshold = ");
    Serial.print(middle + gap);
    Serial.print(", offThreshold = ");
    Serial.println(middle - gap);
  }

  delay(200);
}
