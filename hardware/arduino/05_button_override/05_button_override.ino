// 05 — Extension: push-button mode switch (digital input)
// Hardware unit, beginner-lab-skills.md section L6. Board: Arduino Uno R3 (5 V).
//
// Wiring: same as 01_light_indicator_basic, plus
//   Pin 2 -> push button -> GND
// No external resistor is needed: INPUT_PULLUP turns on the chip's
// internal pull-up resistor, so the pin reads HIGH when the button is
// released and LOW when it is pressed.
//
// Each press cycles the mode: AUTO -> ALWAYS ON -> ALWAYS OFF -> AUTO ...
// AUTO uses the light sensor with hysteresis, like sketch 02.
//
// Status: not yet tested on real hardware.

const int sensorPin = A0;
const int ledPin = 9;
const int buttonPin = 2;

const int onThreshold = 550;
const int offThreshold = 450;
const unsigned long debounceMs = 30;  // ignore bounces shorter than this

enum Mode { AUTO, ALWAYS_ON, ALWAYS_OFF };
Mode mode = AUTO;

bool ledOn = false;

int lastRawButton = HIGH;      // last raw reading
int stableButton = HIGH;       // last debounced state
unsigned long lastChangeTime = 0;

void setup() {
  pinMode(ledPin, OUTPUT);
  pinMode(buttonPin, INPUT_PULLUP);
  Serial.begin(9600);
  Serial.println("Mode: AUTO");
}

// Returns true once per press, after the contacts stop bouncing.
bool buttonPressed() {
  int raw = digitalRead(buttonPin);

  if (raw != lastRawButton) {
    lastChangeTime = millis();  // contacts moved: restart the timer
    lastRawButton = raw;
  }

  if (millis() - lastChangeTime > debounceMs && raw != stableButton) {
    stableButton = raw;
    if (stableButton == LOW) {  // LOW = pressed (pull-up wiring)
      return true;
    }
  }
  return false;
}

void loop() {
  if (buttonPressed()) {
    if (mode == AUTO) {
      mode = ALWAYS_ON;
      Serial.println("Mode: ALWAYS ON");
    } else if (mode == ALWAYS_ON) {
      mode = ALWAYS_OFF;
      Serial.println("Mode: ALWAYS OFF");
    } else {
      mode = AUTO;
      Serial.println("Mode: AUTO");
    }
  }

  if (mode == AUTO) {
    int lightValue = analogRead(sensorPin);
    if (!ledOn && lightValue > onThreshold) {
      ledOn = true;
    } else if (ledOn && lightValue < offThreshold) {
      ledOn = false;
    }
  } else {
    ledOn = (mode == ALWAYS_ON);
  }

  digitalWrite(ledPin, ledOn ? HIGH : LOW);

  // No long delay() here, so button presses are never missed.
  delay(5);
}
