import React from 'react'
import { Box, Slider, SliderMark, SliderTrack, SliderFilledTrack, SliderThumb, Flex } from '@chakra-ui/react'

const TimeSlider = ({ sliderValue, onTimeChange }) => {
  return (
    <Box pt={6} pb={2}>
      <Slider aria-label='Minutes per player' value={sliderValue} onChange={(value) => onTimeChange(value)} min={1}>
        <SliderMark
          value={sliderValue}
          textAlign='center'
          color='black'
          mt='-10'
          ml='-5'
          w='12'
          fontSize={17}
        >
          <Flex gap={1} >
            <Box>{sliderValue}</Box>
            <Box>min</Box>
          </Flex>
        </SliderMark>
        <SliderTrack height={3} borderRadius={10} >
          <SliderFilledTrack bg='bgDark' />
        </SliderTrack>
        <SliderThumb boxSize={6} borderColor='bgDark' />
      </Slider>
    </Box>
  )
}

export default TimeSlider
