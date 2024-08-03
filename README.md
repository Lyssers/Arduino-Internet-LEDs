# Control LEDs hooked up to Arduino with serial commands!

Connect LEDs using the below diagram:

![image](https://github.com/user-attachments/assets/8b0ce991-a353-48b1-9161-30cb0b4439ef)

Then run the program!

Note: make sure the baud value is correct.

In a serial console to the arduino, send it:

R to make the LEDs red

A number to make the LEDs brighter

B to make the LEDs blue

G to make the LEDs green

A to make the lights shift colours like in a rainbow.

P for alternative mode, where you can specify all three LEDs at once to achieve a custom colour, I.e. 100100100 would mean 100 Red, 100 Blue and 100 Green - a pale white. 
Useful for automating with something else, such as hooking it up to some other device able to send commands through a serial console over USB.

Feel free to use this in your projects! 

Or: follow the guide below to make this yourself.

###This is just a little project I made to learn about Arduino programming and electronics. I'm by no means an expert, I just thought it'd be useful to share for someone getting into electronics like I was when I made this:

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

 it is not that electrons are being sent somewhere by some force, rather they are being drawn to where they are not by a difference in force, you can think of electricity as water, a water droplet on a piece of dry cloth will absorb into the cloth and spread out, but if the cloth is already wet, it will not. 

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
}```

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

```void loop()``` will run continuously, think of it as being called after setup in an endless loop. Let’s extend our program to now blink the LED.

```  int redPin = 3;
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


