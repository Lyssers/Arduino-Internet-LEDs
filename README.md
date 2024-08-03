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
