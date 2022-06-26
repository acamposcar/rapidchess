import React from 'react'
import { Box, Slider, SliderMark, SliderTrack, SliderFilledTrack, SliderThumb } from '@chakra-ui/react'

const TimeSlider = (props) => {
  const labelStyles = {
    mt: '2',
    ml: '-2.5',
    fontSize: 'sm'
  }

  return (
    <Box pt={6} pb={2}>
      <Slider aria-label='Minutes per player' onChange={(value) => props.onTimeChange(value)}>
        <SliderMark value={25} {...labelStyles}>
          25 min
        </SliderMark>
        <SliderMark value={50} {...labelStyles}>
          50 min
        </SliderMark>
        <SliderMark value={75} {...labelStyles}>
          75 min
        </SliderMark>
        <SliderMark
          value={props.sliderValue}
          textAlign='center'
          bg='blue.500'
          color='white'
          mt='-10'
          ml='-5'
          w='12'
        >
          {props.sliderValue}
        </SliderMark>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </Box>
  )
}

export default TimeSlider
