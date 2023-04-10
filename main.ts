let message = ""
let AQI = 0
let mq135sensorreading = 0
let sensor_reading = 0
let aqi_type = "nnoice"
let min_reading = 100
let max_reading = 900
let max_AQI = 500
esp8266.init(SerialPin.P16, SerialPin.P15, BaudRate.BaudRate115200)
if (esp8266.isESP8266Initialized()) {
    basic.showIcon(IconNames.Yes)
} else {
    basic.showIcon(IconNames.No)
}
basic.pause(1000)
basic.clearScreen()
basic.forever(function () {
    let min_AQI = 0
    mq135sensorreading = pins.analogReadPin(AnalogPin.P0)
    AQI = (mq135sensorreading - min_reading) / (max_reading - min_reading) * (max_AQI - min_AQI) + min_AQI
    if (AQI <= 50) {
        aqi_type = "Good"
    } else if (AQI <= 100) {
        aqi_type = "Moderate"
    } else if (AQI <= 150) {
        aqi_type = "Unhealthy for Sensitive Groups"
    } else if (AQI <= 200) {
        aqi_type = "Unhealthy"
    } else if (AQI <= 300) {
        aqi_type = "Very Unhealthy"
    } else {
        aqi_type = "Hazardous"
    }
    esp8266.uploadThingspeak(
    "ZRQOUUE5NHMTH307",
    input.temperature()
    )
    if (esp8266.isThingspeakUploaded()) {
        basic.showIcon(IconNames.Happy)
    } else {
        basic.showIcon(IconNames.Sad)
    }
    message = "The AQI is " + ("" + AQI) + "(" + aqi_type + ")" + " and the temperature is" + ("" + input.temperature())
    esp8266.sendTelegramMessage("6165625481:AAGHPnsufYSicuwVs6zdARAqGKpGqWxYzko", "5840903040", message)
})
