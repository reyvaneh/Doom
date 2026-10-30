// 02 — Automatic light indicator with smoothing and hysteresis
// Hardware unit, sections B7 and B11. Board: Arduino Uno R3 (5 V).
// Same wiring as 01_light_indicator_basic.
//
// Smoothing: average several readings to reduce noise.
// Hysteresis: two thresholds, so the LED does not flicker when the
// light level sits near one value. Set both from your own readings
// (use 03_calibrate_ldr to find them).
//
// Status: not yet tested on real hardware.

const int sensorPin = A0;
const int ledPin = 9;
const int onThreshold = 550;   // turn LED on when reading rises above this
const int offThreshold = 450;  // turn LED off only when reading falls below this
const int samples = 10;

bool ledOn = false;

void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
}

int readSmoothed() {
  long total = 0;
  for (int i = 0; i < samples; i++) {
    total += analogRead(sensorPin);
    delay(5);
  }
  return total / samples;
}

void loop() {
  int lightValue = readSmoothed();

  if (!ledOn && lightValue > onThreshold) {
    ledOn = true;
  } else if (ledOn && lightValue < offThreshold) {
    ledOn = false;
  }
  digitalWrite(ledPin, ledOn ? HIGH : LOW);

  // Printed as "label:value" so the Serial Plotter can draw each line.
  Serial.print("light:");
  Serial.print(lightValue);
  Serial.print(" on:");
  Serial.print(onThreshold);
  Serial.print(" off:");
  Serial.println(offThreshold);

  delay(50);
}
