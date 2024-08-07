import serial
import time
import RPi.GPIO as GPIO
from fastapi import FastAPI
import uvicorn

password = "DEFAULT"

app = FastAPI()
control = True

@app.get("/arduino-colour-set")
def setLED(colour = "000000000", secretKey = "a"):
	global control
	if ((secretKey == password) and (control == True)):

		#GPIO.setmode(GPIO.BCM)
		#GPIO.setup(12, GPIO.OUT)
		#GPIO.output(12,1)
		#time.sleep(2)
		#print(ser.readline().decode('utf-8').rstrip())
		ser.reset_output_buffer()
		ser.reset_input_buffer()
		ser.write((colour + "\n").encode())
		#print(ser.readline().decode('utf-8').rstrip())
		print(colour)
		response = "\n"
		#while ser.in_waiting:  # Or: while ser.inWaiting():
		#	response = response + ser.readline().decode('utf-8').rstrip() + "\n"
		#print(response)
		#return {"OK - LED set to: " + colour + "\n" + response}
		return {"OK - LED set to: " + colour + "\n"}
		print ("OK - LED set to: " + colour)
		#GPIO.output(12,0)
		#GPIO.cleanup()
		ser.reset_output_buffer()
		ser.reset_input_buffer()
	else: 
		print("Warning: Unauthorized Access")
		return{"That's so heckin' uncool"}


@app.get("/arduino-rainbow")
def rainbow(secretKey = "a"):
	global control
	if ((secretKey == password) and (control == True)):
		ser.reset_output_buffer()
		ser.reset_input_buffer()
		ser.write("p".encode())
		time.sleep(1)
		ser.write("a".encode())
		time.sleep(1)
		ser.write("253".encode())
		response = "\n"
		#while ser.in_waiting:  # Or: while ser.inWaiting():
		#	response = response + ser.readline().decode('utf-8').rstrip() + "\n"
		#print(response)
		ser.reset_output_buffer()
		ser.reset_input_buffer()
		control = False
		return{"OK - Rainbow Enabled! Colour control disabled. Hit the /arduino-rainbow-off endpoint to turn it off!"}
	else:
		return{"That's so heckin' uncool"}

@app.get("/arduino-rainbow-off")
def rainbowoff(secretKey = "a"):
	global control
	if ((secretKey == password) and (control == False)):
		ser.reset_output_buffer()
		ser.reset_input_buffer()
		ser.write("a".encode())
		time.sleep(2)
		ser.write("p".encode())
		time.sleep(2)
		ser.reset_output_buffer()
		ser.reset_input_buffer()
		control = True
		return{"OK - Rainbow Disabled! Colour control restored."}
	else:
		return {"That's so heckin' uncool"}
		

if __name__ == "__main__":
	ser = serial.Serial('/dev/ttyUSB0', 500000,timeout = 1)
	control = True
	time.sleep(5)
	ser.write("p\n".encode())
	time.sleep(2)
	uvicorn.run(app, host="0.0.0.0", port=5000, log_level="info")
