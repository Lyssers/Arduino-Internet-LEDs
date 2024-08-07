import React, { useState, Fragment, useEffect } from 'react';
import Wheel from '@uiw/react-color-wheel';
import { hsvaToHex, hsvaToRgbString, hsvaToRgba } from '@uiw/color-convert';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { motion } from "framer-motion";

// Please do not forget to change the requestUrl and the secretKey parameter in each axios request
// TODO: It's probably a good idea to make the secret key a variable loaded from a config.json at build time at least, if not runtime if I'm going to add any more requests


function colorFormatter(newcolor) {

  //console.log(newcolor.length);
  if (newcolor.length === 1) {
    newcolor = ("00" + newcolor);
  }
  if (newcolor.length === 2) {
    newcolor = ("0" + newcolor);
  }
  return newcolor;

}

var red;
var blue;
var green;
const requestURL = "http://iporurl:5000";

//Main Function
const App = () => {

  const [rainbow, setRainbow] = useState(false);

  const handleRainbow = (event) => {
    setRainbow(!rainbow);
  }

  //Colour

  const [hsva, setHsva] = useState({ h: 214, s: 43, v: 90, a: 1 });
  const handleChange = (color) => {

    red = colorFormatter(new String((hsvaToRgba({ ...color.hsva }).r)));
    green = colorFormatter(new String((hsvaToRgba({ ...color.hsva }).g)));
    blue = colorFormatter(new String((hsvaToRgba({ ...color.hsva }).b)));
    setHsva({ ...hsva, ...color.hsva }, () => { });

  }

  useEffect(() => {

    const transmitNewColor = async () => {

      console.log("Red " + red);
      console.log("Green " + green);
      console.log("Blue " + blue);
      //console.log(blue);
      console.log(requestURL + "/arduino-colour-set?secretKey=default&colour=" + red + green + blue);
      var response = await axios.get(requestURL + "/arduino-colour-set?secretKey=default&colour=" + red + green + blue);
    }

    transmitNewColor();
  }, [hsva]);

useEffect(() => {

    const transmitRainbow = async () => {

      if (rainbow){
        console.log(requestURL + "/arduino-rainbow?secretKey=default");
        var response = await axios.get(requestURL + "/arduino-rainbow?secretKey=default");
      }

      if (rainbow === false){
        console.log(requestURL + "/arduino-rainbow-off?secretKey=default");
        var response = await axios.get(requestURL + "/arduino-rainbow-off?secretKey=default");
      }
      
    }
    transmitRainbow();
}, [rainbow])


  //Hide
  const [checked, setChecked] = React.useState(true);
  const handleHide = (event) => {
    //alert('You changed me!');
    setChecked((prev) => !prev);
  }

  useEffect(() => {

    const ledOff = async () => {
    if (checked){
      var response = await axios.get(requestURL + "/arduino-colour-set?secretKey=default&colour=" + red + green + blue);
    }
    if (!checked){
      var response = await axios.get(requestURL + "/arduino-colour-set?secretKey=default&colour=000000000");
    }
    
  }
    ledOff();
  }, [checked])

  return (
    <div className="wrapper">



      {/* Slide animation and Paper */}

      <Slide direction="up" in={checked}>
        <Paper elevation={10} sx={{ display: 'flex', flexWrap: 'wrap', placeContent: 'center' }}>
          <Box margin={2}>
            <Stack
              direction="column"
              spacing={1}
              alignItems="center">

              {/* Content */}

              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
                animate={checked === true ? { opacity: 1, scale: 1, rotate: 360 }: { opacity: 0, scale: 0.5, rotate: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.2,
                  ease: [0, 0.71, 0.2, 1.01]
                }}>
                <motion.div
                  initial={{rotate:0}}
                  animate={rainbow === true ? {rotate: 360, transition: {
                    duration: 2,
                    ease: "linear",
                    repeat: Infinity,
                    repeatDelay: 0}} : {rotate: 0}}>
                  
                  <Fragment>
                    <Wheel color={hsva}
                      onChange={handleChange}
                    />

                  </Fragment>
                </motion.div>
              </motion.div>

              <Divider orientation="vertical" />
              <div style={{ width: '100%', height: 34, background: hsvaToHex(hsva) }}></div>
              <Divider orientation="vertical" />
            </Stack>

            
            <Box mt={2}>
              <Stack
                direction="column"
                spacing={2}
                alignItems="center">
                  <Typography color="text.secondary" variant="body2">
                  {hsvaToRgbString(hsva)}
                  </Typography>
                
                <Stack direction="row"
                  spacing={2}
                  alignItems="center">
                  <Typography color="text.secondary" variant="body2">
                    {hsvaToHex(hsva)}
                  </Typography>
                  <Divider orientation="vertical" flexItem />
                  <FormControlLabel
                    control={<Switch onChange={handleRainbow} defaultChecked={false} />}
                    label="Rainbow"
                  />
                </Stack>
                
              </Stack>
            </Box>
          </Box>
        </Paper>
      </Slide>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', placeContent: 'end center' }}>
        <FormControlLabel
          control={<Switch onChange={handleHide} defaultChecked />}
          label="LED"
        />

      </Box>
    </div>

  );
}
export default App;

