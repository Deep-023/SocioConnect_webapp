import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material'
import Form from "./Form"

import { useCallback } from "react";
import Particles from "react-particles";
//import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "tsparticles-slim";

const LoginPage = () => {

  const particlesInit = useCallback(async engine => {
    console.log(engine);
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    //await loadFull(engine);
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async container => {
    await console.log(container);
  }, []);

  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  return (
    <Box>
      <Box width="100%" backgroundColor={theme.palette.background.alt}
        p="1rem 6%" textAlign="center"
        position="fixed" zIndex={5}
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          SocioConnect
        </Typography>
      </Box>
      <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
                fpsLimit: 120,
                interactivity: {
                    events: {
                        onClick: {
                            enable: true,
                            mode: "push",
                        },
                        onHover: {
                            enable: true,
                            mode: "repulse",
                        },
                        resize: true,
                    },
                    modes: {
                        push: {
                            quantity: 6,
                        },
                        repulse: {
                            distance: 150,
                            duration: 0.4,
                        },
                    },
                },
                particles: {
                    color: {
                        value: "#00D5FA",
                    },
                    links: {
                        color: "#00D5FA",
                        distance: 150,
                        enable: true,
                        opacity: 0.5,
                        width: 1.5,
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: true,
                        speed: 3,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 800,
                        },
                        value: 100,
                    },
                    opacity: {
                        value: 0.7,
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 1, max: 5 },
                    },
                },
                detectRetina: true,
            }}
        />
      <Box width={isNonMobileScreens ? "40%" : "93%"}
        p="1rem 2rem" m="2rem 1rem" borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
        position="fixed" ml="28.5rem" zIndex={5} mt='7rem'
      >
            
        <Typography fontWeight="500" variant='h5' sx={{ mb: "1rem" }}>
          Welcome to SocioConnect, the Social Media for Techies!
        </Typography>
        <Form />
      </Box>

    </Box>
  )
}

export default LoginPage