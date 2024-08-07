int redPin = 3;
int greenPin = 6;
int bluePin = 5;
String colour;
String message;
int currentPin;
int intensity = 10; //Initial Intensity
bool programmatic = false;
bool alternating = false;



void setup() {
pinMode(6, OUTPUT);
pinMode(5, OUTPUT);
pinMode(3, OUTPUT);
Serial.begin(500000); //Set Baud to this value, or change this value.
}

void loop() {
    while (serialInterrupt()) {

    //Simpler Protocol for machine to machine communication  
    if (programmatic){
      String command = Serial.readString();
      Serial.println(command);
      if (command == "p"){
        Serial.println("Programmable Mode Deactivated");
        programmatic = !programmatic;
      }
      else{
        alternating = false;
        setAllPins(command.substring(0,3).toInt(), command.substring(3,6).toInt(), command.substring(6,9).toInt()) ; //Extract values from command
        Serial.flush();
        //Format: 100100100 = 100 Red, 100 Blue, 100 Green
      }
      
    }

    //For manual control:
    else{

    // read the incoming byte:
    message = Serial.readString();
    Serial.flush();

    // say what you got:
    Serial.println("I received: " + message);
    
    int level = message.toInt();
   
    if (level < 256 && level > 0){
      Serial.println("hello there debugger" + level);
      intensity = level;
      analogWrite(currentPin, intensity);
      Serial.print("Intensity Set to: ");
      Serial.println(level);
    }
    switch (message[0]) {
        case 'r':
          currentPin = redPin;
          Serial.println("\nRED LED SET");
          analogWrite(bluePin,0);
          analogWrite(greenPin,0);
          analogWrite(redPin, intensity);
          break;

        case 'b':
          currentPin = bluePin;
          Serial.println("\nBLUE LED SET");
          analogWrite(redPin,0);
          analogWrite(greenPin,0);
          analogWrite(bluePin,intensity);
          break;

        case 'g':
          currentPin = greenPin;
          Serial.println("\nGREEN LED SET");
          analogWrite(bluePin,0);
          analogWrite(redPin,0);
          analogWrite(greenPin, intensity);
          break;

        case 'a': //For Rainbow
          alternating = !alternating;
          break;

        case 'p':
          programmatic = !programmatic;
          alternating = false;
          Serial.println("\nProgrammatic Mode Activated");
          break;

      }
      }
    }
    //For Rainbow
    if (alternating){
      rainbow();
    }
  
}

void rainbow(){
  Serial.println("\nInitiating Rainbow...");
  pinIntensifier(redPin, 1);
  pinIntensifier(bluePin, 0);
  pinFader(redPin, -1);
  pinIntensifier(greenPin, 0);
  pinFader(bluePin, -1);
  pinIntensifier(redPin, 0);
  pinFader(greenPin, -1);
  pinFader(redPin, 0);
  
}

void pinIntensifier(int pin, int startValue){
  for (int i = startValue; i < intensity && !serialInterrupt(); i++){
    analogWrite(pin,i);
    delay(constrain((10*100-(intensity*4)), 10, 500));
  }
}
void pinFader(int pin, int minValue){
  for (int i = intensity; i > minValue && !serialInterrupt(); i--){
    analogWrite(pin,i);
    delay(constrain((10*100-(intensity*4)), 10, 500));
  }
}

bool serialInterrupt(){
  return (Serial.available() > 0);
}

void setAllPins(int redIntensity, int greenIntensity, int blueIntensity){
  //Sanity Checks
  if (redIntensity < 256 && redIntensity > -1 && blueIntensity < 256 && blueIntensity > -1 && greenIntensity < 256 && greenIntensity > -1 ){ 
    analogWrite(redPin, redIntensity);
    Serial.print("Red to: ");
    Serial.println(redIntensity);
    analogWrite(bluePin, blueIntensity);
    Serial.print("Blue to: ");
    Serial.println(blueIntensity);
    analogWrite(greenPin, greenIntensity);
    Serial.print("Green to: ");
    Serial.println(greenIntensity);
    Serial.println();
  }
}
