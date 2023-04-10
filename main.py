AQI = 0
mq135sensorreading = 0
message = ""
aqi_type = "nnoice"
min_reading = 100
max_reading = 900
max_AQI = 500
esp8266.init(SerialPin.P16, SerialPin.P15, BaudRate.BAUD_RATE115200)
if esp8266.is_esp8266_initialized():
    basic.show_icon(IconNames.YES)
else:
    basic.show_icon(IconNames.NO)
basic.pause(1000)
basic.clear_screen()

def on_forever():
    global mq135sensorreading, AQI, aqi_type, message
    min_AQI = 0
    sensor_reading = 0
    mq135sensorreading = pins.analog_read_pin(AnalogPin.P0)
    AQI = (mq135sensorreading - min_reading) / (max_reading - min_reading) * (max_AQI - min_AQI) + min_AQI
    if AQI <= 50:
        aqi_type = "Good"
    elif AQI <= 100:
        aqi_type = "Moderate"
    elif AQI <= 150:
        aqi_type = "Unhealthy for Sensitive Groups"
    elif AQI <= 200:
        aqi_type = "Unhealthy"
    elif AQI <= 300:
        aqi_type = "Very Unhealthy"
    else:
        aqi_type = "Hazardous"
    esp8266.upload_thingspeak("ZRQOUUE5NHMTH307", input.temperature())
    if esp8266.is_thingspeak_uploaded():
        basic.show_icon(IconNames.HAPPY)
    else:
        basic.show_icon(IconNames.SAD)
    message = "The AQI is " + ("" + str(AQI)) + "(" + aqi_type + ")" + " and the temperature is" + ("" + str(input.temperature()))
    esp8266.send_telegram_message("6165625481:AAGHPnsufYSicuwVs6zdARAqGKpGqWxYzko",
        "5840903040",
        message)
basic.forever(on_forever)
