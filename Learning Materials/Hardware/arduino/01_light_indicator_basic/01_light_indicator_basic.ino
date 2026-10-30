// 01 — Automatic light indicator (basic)
// Hardware unit, section B11. Board: Arduino Uno R3 (5 V).
//
// Wiring (see B6 and B8):
//   5V  -> 10 kΩ resistor -> A0 -> LDR -> GND   (voltage divider)
//   Pin 9 -> 330 Ω resistor -> LED anode (long leg) -> LED cathode -> GND
//
// With the LDR as the lower resistor, darker = higher reading.
// The threshold 500 is a starting point only: open the Serial Monitor
// (9600 baud), note your bright and dark readings, and pick a value between.
//
// Status: not yet tested on real hardware.

const int sensorPin = A0;
const int ledPin = 9;
const int darkThreshold = 500;

void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int lightValue = analogRead(sensorPin);  // 0–1023
  Serial.println(lightValue);

  if (lightValue > darkThreshold) {
    digitalWrite(ledPin, HIGH);  // dark: LED on
  } else {
    digitalWrite(ledPin, LOW);   // bright: LED off
  }

  delay(100);
}
