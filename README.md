# Control LEDs hooked up to an Arduino via the internet!

Connect LEDs using the below diagram:

![image](https://github.com/user-attachments/assets/8b0ce991-a353-48b1-9161-30cb0b4439ef)

Then compile and run the program on the arduino

Note: make sure the baud value is correct. Mine is set very non-standard by default. It just happens to work the best in my testing. I’m not entirely sure how Baud in serial communication works on modern computers, is there a max? A software limit? Hardware limit? Lemme know.

In a serial console to the arduino, send it:

R to make the LEDs red

A number to make the LEDs brighter

B to make the LEDs blue

G to make the LEDs green

A to make the lights shift colours like in a rainbow.

P for alternative mode, where you can specify all three LEDs at once to achieve a custom colour, I.e. 100100100 would mean 100 Red, 100 Blue and 100 Green - a pale white. 
Useful for automating with something else, such as hooking it up to some other device able to send commands through a serial console over USB.

If all works,

# Then connect the arduino to a computer (e.g. a Raspberry Pi) and run the .py file

Resolve dependencies if any errors occur. You'll probably want to install the PySerial library with pip3 install pyserial and fastAPI.

It uses FastAPI and Uvicorn to quickly spin up an API you can send web requests to to interact with the Arduino over USB using the serial protocol as above.

To avoid heartache, make sure to replace the password variable in the Python script before running.

If using on a Raspberry Pi, you'll probably want to ensure the Serial interface is enabled via `sudo raspi-config`

On Linux, you should be able to see a ttyUSBX where X is some number in your /dev/ folder.

A command like `ls /dev/tty*` should list it.

And that should be it, fire off a request to it like:

With cURL:

curl "http://{your_domain_or_Ip}:5000/arduino-colour-set?secretKey=default&colour=230008000"

or via the web browser by just hitting that URL.

Make sure to replace the domain/IP with the IP or domain by which your server is accessible.

You'll need to forward the port on your router or use a reverse proxy or something like a cloudflare tunnel. Personally I just keep it open and use no-ip for dyndns, it's fun to see people trying to dir bruteforce the API in the logs.

Feel free to use this in your projects! 

Or: follow the below tutorial as a project to DIY!

### This is just a little project I made to learn about Arduino programming and electronics. I'm by no means an expert, I just thought it'd be useful to share for someone getting into electronics. A tutorial on this can be found below:

You'll need 
- An Arduino, obviously. Actually I don't have one, so I used a cheap arduino-compatible Keyestudio board which did just fine.
- A breadboard aka a protoboard. It is a piece of plastic with holes in it, underneath, there are metal strips that go along the length of the board and in two sets across the board. since metal is conductive, this will allow us to connect components by simply inserting them into a hole. The strips that go along the length of the board are called power rails, and are usually denoted with red and blue or red and green for positive and negative, you don’t actually have to use them that way, it’s just convenient. Once one of the holes has current being provided down it, it will conduct across the metal strip underneath, for example powering an LED from a power connector. 
- Cirkit Designer, a piecec of software to make diagrams of typical entry level arduino projects. You can use this to either make your own circuit diagram, or to load a more detailed one supplied here (it's the .ino file!).
- LEDs, obviously - while you could get an LED with wires attached, I used simple LEDs with metal leg terminals, I could get cheaply in packs. Mouser Electronics is a great resource by the way and the shipping is better than literally any other company. Learn electronics to experience how actually functional online ordering and delivery works! RGB LEDs are simply three LEDs in one package, they are either of the common cathode or common anode variety, the former having one ground and three positive pins for each colour and the latter have three grounds for each pin with one positive.
- Resistors, you'll need plenty of 'em. Without resistors, current will destroy/burn/nuke the LEDs. 

The kind of LEDs you need don't actually matter, just bear in mind that with common cathode LEDs to turn it on and control it you will need to connect the anode terminal for each colour to a different GPIO pin and the common cathode terminal to a ground pin, then set a pin or combination of pins corresponding to the colour you want to high to create a voltage difference between the colour anode terminal and the common cathode terminal and thus turn on the LED, but for common anode LEDs you connect the common anode to the 5v out pin and you need to set the pin connected to the colour terminal low in order to create a voltage difference and allow the current to flow and light up your LED.

In my case, I used common anode LEDs, HV-5RGB60 to be precise.

You need resistors because an LED is diode which is basically something that activates based on a certain voltage being reached. But once this is the case, a diode has very low internal resistance so the amount of current that passes through it could absolutely nuke it.

> But why?

It's easy to think of power supplies as supplying energy to some kind of energy consuming device and from a layman's point of view - that is exactly what occurs. But actually it's a little more complex. When it comes to energy flow, or current - it is the load, or the non-power supplying part of a circuit that decides how much is drawn, and not the power supply that decides how much to pump in, but the power supply will decide the pressure at which it is done, known as voltage.

> But why?

 it is not that electrons are being sent somewhere by some force, rather they are being drawn to where they are not - by a difference in force. You can think of electricity as water, a water droplet on a piece of dry cloth will absorb into the cloth and spread out, but if the cloth is already wet, it will not. 

To continue with this analogy:

Voltage also known as electric potential difference is essentially this wetness differential between the dry and wet, it is the potential for wetness or in this case the pressure exerted by an electric field on electrons which carry a negative charge to - through electromagnetism - move towards that which is positively charged, the more potential energy - the more work is done, like a ball that has more potential kinetic energy the higher it is thrown making it move on its way down for longer, at the rate given to it via acceleration by the earth's gravitational field. When you think about it - this is why Ohm's Law, or Voltage being Proportional to Current makes sense, the less pressure is exerted on electrons to actually do their thing and move, the less potential energy they have and the less work will be done by lessened flow of electrons.

But without restrictions, electrons will simply move as their pressure makes them regardless of whether it will blow up your LED or not.

While LEDs do have some small internal resistance, it is incredibly minor and can be largely disregarded, most LEDs are meant to operate at 20mA of current and list that as the optimal condition for operation on data sheets, while our Arduino's GPIO pins operate at a logical high level of 5V, given that we know to achieve 20mA at 5V we need to V/I=R or 5v/(20mA*10^-3)=5v/0.020A=250ohms

I didn't have any 250ohm resistors but so I used 230ohm ones which will give us 0.021 Amps or 21 miliamps of current which is pretty close.

A resistor works by restricting current flow across its terminals by being made out of a material that is less conductive, thus more resistive, as a result of lower conductivity and lower current flow, voltage or again, pressure will drop as well, and the voltage drop across each resistor in a circuit will add up to the total voltage of the positive power supply terminal.

So since an RGB LED is 3 LEDs, and I want at least 4 of those, that means 12 LEDs total and 12 resistors and 12 GPIO pins on the Arduino not counting the ground.

Unfortunately, there are only 6 pins on the Arduino capable of doing PWM, which we’re gonna want to control brightness of the LED. PWM is Pulse Width Modulation, since Arduino and Pi don’t have true hardware Analog output, to simulate it they use PWM, which pulses a logical HIGH, in Arduino’s case a 5v signal at a set width, by modulating this width, known as Duty Cycle, it achieves an average voltage thus reducing the duty cycle reduces the ON time, and therefore the average voltage, and as such - the current flowing through whatever load we have on our circuit. 

Also when in electronics people say ground they’re referring to the common voltage reference ground, voltage can be described as a difference in pressure on electrons to flow, and that requires two ends between which this difference exists. So it is actually the neutral wire which completes the circuit and returns the voltage back to the Arduino and through the USB cable and pack to the mains AC plug and to the grid, completing the circuit, it’s not the same as the actual ground wire that is a low resistance part of a mains plug and is used as a path for current to flow to pop the breaker in your home in case of an electrical fault, as opposed to finding a path through your hands eager for the warmth of a fresh piece of toast bread in the bath.

But even if 12 pins could do PWM, I don't really want to use 12 whole GPIO pins on the Arduino for this, and I can’t connect them in series because we only have 5v to play with considering the forward voltage drop-off, however if I want to have three per pin instead in parallel through daisy chaining the cables and having a resistor with each LED in series our current would be 5/230+5/230+5/230 I would be drawing something like 65mA from each pin. Per the Arduino datasheet absolute max is 40mA, <35mA is realistically okay and 20mA is the continuous max.

So how do you solve this?

With LEDs and Diodes and other weird magical silicon stuff, we need to account for the forward voltage, by looking at the datasheet for the LEDs, in my case this would be: https://www.mouser.co.uk/datasheet/2/180/Inolux-05-17-2019-HV-5RGBXX_5mm_Full-Color_Series_-1595273.pdf

We can see that the forward Voltage drop is like so:

![image](https://github.com/user-attachments/assets/27f06a9c-79b3-475b-b2da-b3d3d482304a)

Which means that the actual calculation would be as follows:
(V-Vf)/R=I
(5v-2.0v)/230 = 13mA

For four Red LEDs, that would be between 52mA - 41mA depending on voltage drop and around 27mA for four blue or green LEDs. That was still out of spec.

Even if running it off the GPIO pins like this works, with electronics it’s quite common that out-of-spec performance like this could damage the components over time, rather than instantly blowing up in spectacular fashion.

See the GPIO pins on the Arduino do have a current limit of 20mA, but not the direct power supply pins, as those are connected straight to the power input of the arduino itself. The 5v power pin on the bottom of the board has a maximum current rating of 800mA although most people seem to suggest that staying below 400-500mA is best when powered with a USB cable and I can understand why as that would prolong the life of any heat dissipation components on the arduino itself.

The problem with the 5V pin however is that it cannot be switched off, there’s no logic on it and no way of interfacing with it that I’m aware of at least, so we have to find a way to control the current flow from the 5v pin to the LED. I'm sure you could come up with some weird hacky solution to this, but why do this when we have another magical silicon device called a transistor.

I used BJT BCE NPN transistors: https://eu.mouser.com/datasheet/2/389/bul7216-1849084.pdf

Transistors are rather complex. They revolutionized like, everything, man.

Sufficed to say, NPN transistors (Negative-Positive-Negative) take an input of current to the collector pin and if there is current applied to the base pin, will “emit” the current from the emitter pin and PNP ones do the opposite. This way, we can connect our GPIO pin to the base pin of a NPN transistor, then the 5v pin to the collector pin, and the LED anode to the emitter pin. Even simpler: it closes a circuit between two outer bits when a small amount of current is applied to the middle bit.

If we do that for all four LEDs

The overall result is 

((5-2.0)/230+(5-3.4)/230+(5-3.4)/230)*4)=0.107A or around 100mA of current, which the 5v pin is more than happy to provide.

Now to program the Arduino

You're gonna need

- A USB-A to USB Mini B cable to connect the Arduino
- A copy of the Arduino IDE

At the top, select board type and COM port, ProTip for this: I found if you’re connecting via USB, you should have a COM port with (USB) in brackets, like so:

![image](https://github.com/user-attachments/assets/a8d7b04c-ef52-4b3e-b7f5-5f10530410e3)

That’s your port. But when i tried this, it didn’t work, the port simply didn’t show up at all - but after some searching I found the solution, I tried checking Device mangler on windows to see if I could spot any yellow triangles on the USB controllers and sure enough I did. 

Turns out I needed to install the CP210x universal driver by downloading it here: https://www.silabs.com/documents/public/software/CP210x_Universal_Windows_Driver.zip

Unzip it, then select the driver through the device manager by right clicking and selecting update driver, then choosing to browse locally:

![image](https://github.com/user-attachments/assets/cbb529f5-2c23-416c-83b8-08dfbfc17a4b)

Then mine appeared like this in Device Manager:

![image](https://github.com/user-attachments/assets/d7e9c31b-e4f9-402b-ad5c-cf03f04e5f01)

With that, everything should work. If it doesn't, google is your friend.

Arduino code is written in something technically called The Arduino Language, but it really is just C++ with extensions/libraries for interacting with the Arduino and optimizations during the precompile phase, if you’re familiar with C++ and better yet - C, then you should be able to get going in no time.

By the way, you don’t actually have to use the Arduino IDE, if you make or find a deployment and compiler/linker chain of your own you can write any code that will compile for the ATMEGA chip and write it however you want in say the Eclipse IDE or whatever.

The reason why C is useful for the Arduino Language because the C++ standard library is not available for Arduino, nevermind .NET if you use that for Windows, in fact the constraints we’re dealing with here make it highly improbable, and with that a lot of familiar things are unimplemented, such as true multithreading, arrays and cout/cin syntax. Some types also don’t match up to their C++ equivalent specification, for example byte, so just be careful, read the docs and use print statements. 

Speaking of, how do you print on an Arduino exactly?

Well unless you want to communicate things in morse code with LEDs, you will be printing to the Serial port, which is why you’re gonna want to open the Serial Monitor in the IDE.

![image](https://github.com/user-attachments/assets/00e1b9eb-5c05-44ec-aaa7-4e176bfd56ac)

This lets you send and receive messages from the Arduino. We’re going to make use of this to control the LEDs, but first let’s make sure our circuit is actually working.

```void setup()``` is the first half of your main function, think of it as being called once at the beginning of the entrypoint function. Since we just want our code to run once to turn a pin on to test the circuit, we can just use only it for now:

```void setup() {
  // put your setup code here, to run once:
  pinMode(6, OUTPUT);
  pinMode(5, OUTPUT);
  pinMode(3, OUTPUT);
  Serial.begin(9600);
  int redPin = 3;
  int greenPin = 6;
  int bluePin = 5;
  int intensity = 10;
  Serial.println("RED LED SET");
  analogWrite(redPin, intensity);       
}
```

First you need to set the arduino pins as outputs which lets you “write” to them, then enable serial communication, specifying the Baud rate, which must match the Baud rate of whatever Serial device on the other end, in this case the default Baud of the Serial Monitor in the Arduino IDE is 9600 so I decided to leave it at that for now.

In the above snippet, I've defined pin numbers as integer variables for convenience, as well as intensity at which we want the LEDs to light up, this should be an integer between 0 and 255. There's nothing special about this really.

Serial.println() will then print a line of text over serial, followed by an end of line character: \n, indicating that whatever we print next should start on the next line.

analogWrite is the function that lets use PWM instead of just a Digital HIGH or LOW value to create a faux-analog value, it takes two parameters, pin number and intensity. Since we only want the red pin for now, we call the function specifying the pin and intensity.

If everything has been wired correctly and you’ve set the correct pin numbers when declaring the integer variables for them (hint: the pins are physically labeled on the arduino board), the program should print to the screen  “RED LET SET” and then turn on all LEDs set to red.

If it has not been wired correctly. It will explode.

Just kidding. To troubleshoot I'd suggest a multimeter. An Aneng AN870 is cheap and available for just a few quid on AliExpress. Just don't touch anything Mains voltage or AC with it, no matter what qualifications it claims to have.

To measure voltage, take your multimeter and put the the red probe of choice to the VCC, the easiest way to do so in this particular situation with a breadboard is to insert another jumper cable with a pin into the positive power rail and use an alligator clip probes to connect it to the end of the wire and then do the same for negative. Now plug in the Arduino and as you can see the voltage is around 4.963v which is about right, if we turn on all LEDs the voltage may sag, because of crappy USB cables not delivering the full spec current to the Arduino in the first place.

Now like anyone just getting into electronics who learns by doing, the mAuA socket’s fuse on my multimeter didn’t live long, and that’s because you absolutely MUST NOT do the same for measuring current!

I repeat, if you measure current this way, you will blow the fuse on your multimeter, and/or fry something!

In fact, I almost fried the Arduino as well, I’m not sure how I didn’t, or even if I actually didn’t, as I had the brilliant idea after seeing no reading to plug the wire into the 20A socket instead and saw the full 200mA traveling through the short circuit I had created right back to the arduino, it took me a few seconds to realize exactly what was happening!

So how do you measure current correctly?

Well when you measure current, your multimeter becomes a low resistance wire through which current must travel, therefore you must connect it between the ground of your power supply, in this case the arduino, and the ground rail of your breadboard or wherever the current would flow to the ground of the power supply from normally.

When measuring current you are wiring both ends into the negative! Not one into positive and one into negative! Otherwise all the current will travel through your multimeter (path of least resistance) instead and create a short-circuit!

There are so many garbage instructions online that overcomplicate this so much at least for a total beginner and more generally - idiot like myself, but it’s really as simple as this shamelessly stolen graphic shows:

If you want to measure the overall power consumption of the Arduino, just get one of these USB inline multimeters, they’re very simple and just measure things like voltage and current through the USB port.

https://www.amazon.co.uk/Multimeter-Voltmeter-Capacity-Detector-Upgraded/dp/B07THZFDGH/

Commonly with this sort of stuff I end up wiring the wrong pin, so that a different colour lights up, even with colour coded wires, so if you don’t want to rewire everything, and you’re confident it’s just that that is the issue, you can try swapping the redPin variables with whichever colour actually lit up and determine the correct configuration that way.

`void loop()` will run continuously, think of it as being called after setup in an endless loop. Let’s extend our program to now blink the LED.

```
  int redPin = 3;
  int greenPin = 6;
  int bluePin = 5;
  int intensity = 10;


void setup() {
  // put your setup code here, to run once:
  pinMode(6, OUTPUT);
  pinMode(5, OUTPUT);
  pinMode(3, OUTPUT);
  Serial.begin(9600);
}


void loop() {
  // put your main code here, to run repeatedly:
    Serial.println("\nRED LED SET");
    analogWrite(redPin, intensity);
    delay(1000);
    analogWrite(redPin,0);
    delay(1000);
}
```
the delay() function will pause execution for a certain amount of time, in case 1000 milliseconds, or 1 second.

Notice how because we’re now using variables for the pins and intensity outside the Setup function, to avoid defining them each loop I’ve moved them outside, so that they’re now globally accessible in scope.

Also notice how I’ve added a \n character to the serial output, this will insert a newline between outputs, meaning that we now have an empty line between each printed thing.

This code if working correctly will turn all LEDs to red for one second, then off for one second, and repeat.

We can then extend our Arduino program to read serial input and set color based on that.

First I’m going to write a helper function to determine if Serial input is available - meaning if a message came from the computer, it just makes the code a bit more tidy later on and saves us writing boilerplate copy-paste code.
```
bool serialInterrupt(){
  return (Serial.available() > 0);
}
```

This uses the Serial.available() counter of messages, a built-in function, and checks whether it’s more than 0, returning a boolean with the value of True if it is.

Our code can now look like this:

```
  int redPin = 3;
  int greenPin = 6;
  int bluePin = 5;
  int intensity = 10;
  String message;


void loop() {
    while (serialInterrupt()) {


    // read the incoming byte:
    message = Serial.readString();
    Serial.flush();


    // say what you got:
    Serial.println("I received: " + message);
   
    int level = message.toInt();
    if (level < 256 && level > 0){
      intensity = level;
      analogWrite(redPin, intensity);
      Serial.print("Intensity Set to: ");
      Serial.println(level);
    }
}}
```

Using a while loop conditional on the result of our boolean function, we read the message and flush the buffer, write it back for debugging purposes, then attempt to convert the message to an integer, between 256 and 0, so in the range of 255 and 1, which the analogWrite function will accept, if on the other hand the message is a character, the conversion will result in a zero, and this block will be skipped. 

For now, this allows us to set how bright the red part of the LEDs glow by writing a number in the serial monitor and pressing enter.

Now we can also add a case-switch statement for setting the pin colour:

First let’s add this variable to the globals: `int currentPin;`

```
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
      }
```

If the first character in the message string received is r, say as in red, or redrum or just r, then the red LED will be set to the intensity variable value, either the default of 10 or whatever number we wrote to the arduino in the Serial monitor, while the other two pins will be set to 0, or off.

Now we just have to write Red in the Serial monitor and press enter, then write 20 and press enter, and it should light up the LEDs dimly with a red colour.

That's almost the full functionality as in the code hosted on here!

That should work! Nice! But a bit static, isn’t it? What about having the colours shift and change?

Let’s add another function:


```
void pinIntensifier(int pin, int startValue){
  for (int i = startValue; i < intensity && !serialInterrupt(); i++){
    analogWrite(pin,i);
    delay(constrain((10*100-(intensity*4)), 10, 500));
  }
}
```

It takes two parameters - the pin number and value at which it will start increasing the brightness of the LED.

The for loop will then take this value and assign it to an internal variable i (short for iterator, by the way), then compare that to the intensity global variable which we consider the max brightness to which the colours should go and also make sure that there isn’t fresh data on the serial input by inverting the result of evaluating our boolean function such that if there is data, it would return false and the loop would break. If it doens’t break, it will then increment the iterator for the next loop, writing said iterator to the specified pin, then using the delay function to pause execution.

We could put a static delay here but I find that it doesn’t result in a very smooth experience with low intensity settings as it makes the low intensity cycle drastically faster, so instead I used a linear equation 10*100-x where x is our intensity variable.

The result is that for each increase in X, the result will overall decrease, meaning that the higher the intensity, the lower the delay, making the cycle last the same duration regardless of the intensity. 

If the intensity was 10, the result would be: 10*\100-10=990 or delay of 990ms
If the intensity was 254, the result would be: 10\*100-254=746 or delay of 746ms

Since these numbers are a little meaningless for our milliseconds delay, I multiplied the intensity variable by 4, and used the constrain function to ensure the result is never higher than 500ms or 10ms, which works for me but is really just to taste. Adjust this yourself as you see fit!

If any math nerds or just anyone who didn’t fail high school math at least once before passing like yours truly have a better way of doing this, feel free to get in touch.

Then we make a function to do the opposite:

```
void pinFader(int pin, int minValue){
  for (int i = intensity; i > minValue && !serialInterrupt(); i--){
    analogWrite(pin,i);
    delay(constrain((10*100-(intensity*4)), 10, 500));
  }
}
```

So, fade the pin. the minValue in this case is the variable to which we fade the pin to.

We could actually change the delay constraining values here, to achieve more of a timing to our animation, so that say we could reduce the max value for the constrain function in the pinIntensifier function, while increasing it for the fader function, and at high intensity this will result in more of a breathing effect with fast increase and slow decrease of brightness of each colour.

Now, let’s make a cycle function that will call these two alternatingly on different pins

```
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
```

Printing initiating rainbow on a new line and then calling the functions in the order of brighten->brighten->darken->brighten->darken->brighten->darken->darken

That does mean that we will see the red pin twice as it’s fading out and fading back in again in a loop, but it’s honestly good enough for me. Feel free to improve it though!

Now we can add a way to trigger the rainbow.

Let’s declare a global variable

`bool alternating = false;`

The way I have it in mind is that the rainbow should be triggered by a letter like any other colour by adding this to our switch/case. Since we already used r for rainbow, we now use a for it, for alternating. This solution isn't super elegant but it's concise and readable and works fine, at least most of the time.

```
case 'a': //For Rainbow
          alternating = !alternating;
          break;

```

Now at the bottom of the loop function outside of the serialInterrupt() loop we can add a check for the alternating boolean that if this boolean is true, we call the rainbow function on each runthrough of the loop() function

```
    //For Rainbow
    if (alternating){
      rainbow();
    }
```

Now it should just work™. Not the prettiest neatest code I wrote but it’s functional and performant enough for what amounts to a toy basically.

We can adjust intensity on the fly and even break it by throwing in random colours with R and G and B but it will keep going until we enter “a” again and turn it off, at which point it will actually stop at the colour it was on. Neat!

This essentially concludes the user-interactive part, now we have a cool LED circuit we can control by simply pressing keys and enter into the Serial monitor. However, if we want another machine to be able to control it, it would help if we also added a simpler messaging protocol between the arduino and whatever is sending it commands.

For one, there should be a way to set all pins at once to make it just a tiny bit faster, such as by simply sending 255255255 - an RGB colour format over serial which would result in Red, green and blue all being set to 255 intensity, resulting in a white colour.

We can achieve this by writing the below function:



```
void setAllPins(int redIntensity, int greenIntensity, int blueIntensity){
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
```

The function is simply taking in the parameters for red, green and blue intensities, sanity checking them for being within acceptable ranges, so in the range of 0 and 255, then writing the respective value to the respective pin and printing value for debugging purposes. Simple enough!

Now I just needed to add the ability to switch on what I’m gonna call the very dumb name “programmatic mode” on and off on the fly. I don't think that's even a word. Sounds like it could be a cool electronic band though.

I started by adding these two global variables to switch in and out of programmatic mode and also store the colour RGB numerical string we got.

```
bool programmatic = false;
String colour;
```

We’re going to add this to the top of our loop() function, encapsulating the rest in the else{} block

```
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
        setAllPins(command.substring(0,3).toInt(), command.substring(3,6).toInt(), command.substring(6,9).toInt()) ;
        Serial.flush();
        //Format: 100100100
      }
     
    }


    //For manual control:
    else{
```

We’re also going to add this to the key read section to activate and deactivate programmatic mode, making sure to stop the rainbow before we do, even though we already do for sanity checking reasons in the above snippet

```
case 'p':
  programmatic = !programmatic;
          alternating = false;
          Serial.println("\nProgrammatic Mode Activated");
          break;
```


And that's that!

If you want to also control it over the internet, the best way imo is to use a Raspberry Pi.

Now you could in theory just hook up the lights to a raspberry pi as well, but I did want the arduino-LED set up to be reusable for other things so I segmented it. Bear in mind that due to the speed of serial, USB and the Pi and arduino, this will be slow. Connecting lights to the Pi directly is much faster. Maybe that's a future project?

My Pi had a busted MicroSD card slot, so I booted it off a USB mSATA SSD enclosure, which you can do apparently.

The Python version I used was 3.7.3 and I had already installed pip, feel free to check with `python3 --version` and `pip3 --version` after SSHing into it.

Side note, it may be helpful if you do lots with Python on the Pi to create a virtualenv such as via miniconda or whatever your poison, so go and do that if you want, I didn’t bother since we’re not doing that much here, but it’s good practice overall and for example doing anything with Machine Learning is impossible otherwise I’ve found when I built a basic image classifier, same situation with tmux - quite helpful over SSH to have multiple terminal sessions you can switch between.

We also need to make sure that the Serial interface is enabled on the Raspberry Pi, use the sudo raspi-config command to open the Pi configuration utility and go to interface options and enable the serial interface.

Now I’ll connect the Arduino. Use the sudo ls /dev/ command to list files in the /dev/ folder - where proxy files for devices are created in the Linux filesystem. You should see something like ttyUSB0 in the list, if not, try to grep for it, ala ls /dev/ttyUSB0.

Import the PySerial library along with the time library, and in the main function let’s try to talk to the Arduino: 

```

import serial
import time


if __name__ == "__main__":
    ser = serial.Serial('/dev/ttyUSB0', 500000,timeout = 1)
    time.sleep(5)
    ser.write("p\n".encode())
    time.sleep(2)
    ser.reset_output_buffer()
    ser.reset_input_buffer()
    ser.write(("255000000" + "\n").encode())
    ser.reset_output_buffer()
    ser.reset_input_buffer()
```

This should make the LEDs glow red on the Arduino by first opening a serial port at /dev/ttyUSB0 at the baud rate of 500000. Make sure to of course change it on the Arduino. Why 500000? It just happens to work the best in my testing. I’m not entirely sure how Baud in serial communication works on modern computers, is there a max? A software limit? Hardware limit? Lemme know!

Then will then write a p character and a line break, enabling programmatic mode, followed by some sleep statements to ensure the Arduino can catch up and resetting the buffer to ensure there is no garbage in there, then we write the colour followed by a linebreak character and use the .encode() function to ensure that this is encoded in the right format for Serial communication, followed by once again flushing the buffer for further communication.

So having run it with `python3 script.py` the LEDs lit up as expected, we’re golden!

You can also read what the Arduino wrote back on the serial port (like the debugging info it will write from the `setAllPins()` function like this:

```
while ser.in_waiting:  # Or: while ser.inWaiting():
            response = response + ser.readline().decode('utf-8').rstrip() + "\n"
        print(response)
```

The output should be the same as the output of this code on the Arduino, particularly the Serial.print/println statements:

```
void setAllPins(int redIntensity, int greenIntensity, int blueIntensity){
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
```

To write a Python wrapper around this we can do:

```
def setLED(colour = "255000000"):
    ser.reset_output_buffer()
    ser.reset_input_buffer()
    ser.write((colour + "\n").encode())
    print ("OK - LED set to: " + colour)
    ser.reset_output_buffer()
    ser.reset_input_buffer()


```

If the debug info is all well and good, now I can proceed to now make the pi send different colours by receiving a command over the internet!

Now you can do this using websockets as it’s very basic data, but I think it’s too needlessly low-level for microservices like this and it’s best to make an API, plus I never wrote one before so it's a learning experience!

There are several choices, but for me the easiest and most straightforward is FastAPI.

First I needed to install the FastAPI library, using pip3 install fastapi

Then I also installed uvicorn, which is how the API will be deployed and served by the web server

```
from fastapi import FastAPI
import uvicorn
```

First we need to create a new instance of our app:

`app = FastAPI()`

Now to make our function accessible we need to add an API endpoint annotation to our function definition, I’ll call mine arduino-colour-set

`@app.get("/arduino-colour-set")`

Now this means that when our app is deployed via uvicorn, we can hit an endpoint at our Pi’s IP address and set the colour of the LED to red by commanding the Arduino to set it’s pins accordingly. The .get part determines what kind of request this particular endpoint accepts.

We also need a return statement, let’s take the print from earlier and change it to a return statement

```
@app.get("/arduino-colour-set")
def setLED:
    ser.reset_output_buffer()
    ser.reset_input_buffer()
    ser.write((255000000 + "\n").encode())
    ser.reset_output_buffer()
    ser.reset_input_buffer()
    return {"OK - LED set to: Red" + "\n"}
```

In our main function let’s add the part that will deploy our app using Uvicorn.

```
if __name__ == "__main__":
    ser = serial.Serial('/dev/ttyUSB0', 500000,timeout = 1)
    time.sleep(5)
    ser.write("p\n".encode())
    time.sleep(2)
    uvicorn.run(app, host="0.0.0.0", port=4000, log_level="info")
```

0.0.0.0 will allow us to access this on any IP address over port 5000.

Let’s try to send a request, open your browser and type in your raspberry pi’s IP address followed by our endpoint, in my case this is 192.168.0.24:5000/arduino-colour-set

You can always of course use utilities like cURL to send a GET request also.

Assuming your devices are on the same network it should work, and the LEDs should light up in red and you should get an HTTP response in the browser or for example on commandline after running curl like this:

![image](https://github.com/user-attachments/assets/496d25ef-f685-4b8e-a30a-ccb7b495908e)

But we can also take a parameter for the GET request which we can use to control the colour, by altering the function definition to accept parameters:

`def setLED(colour = "000000000", secretKey = "a"):`

and ser.write to:

`ser.write((255000000 + "\n").encode())`

Now I'd suggest setting a more secure secretKey value and maybe making the password a parameter, or even make a more sophisticated auth scheme! Maybe base64 encode it, at least haha.

And Voila, we got an API written in Python running on our Raspberry Pi that can take requests over the local network to send commands to the Arduino to set colours of an LED.
