// 04 — Extension: LED brightness follows the darkness (PWM)
// Hardware unit, section B9 (PWM). Board: Arduino Uno R3 (5 V).
// Same wiring as 01_light_indicator_basic. Pin 9 supports PWM on the Uno.
//
// Instead of just ON/OFF, the LED gets brighter as the room gets darker.
// Set brightReading and darkReading from 03_calibrate_ldr.
//
// Status: not yet tested on real hardware.

const int sensorPin = A0;
const int ledPin = 9;            // must be a PWM pin: 3, 5, 6, 9, 10, 11

const int brightReading = 200;   // reading in a bright room -> LED off
const int darkReading = 900;     // reading in the dark      -> LED full

void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int reading = analogRead(sensorPin);

  // Keep the reading inside the calibrated range, then rescale it
  // from brightReading..darkReading to a PWM value 0..255.
  int limited = constrain(reading, brightReading, darkReading);
  int brightness = map(limited, brightReading, darkReading, 0, 255);

  analogWrite(ledPin, brightness);

  Serial.print("reading:");
  Serial.print(reading);
  Serial.print(" pwm:");
  Serial.print(brightness);
  Serial.print(" duty%:");
  Serial.println(brightness * 100L / 255);

  delay(50);
}
