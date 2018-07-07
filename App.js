import React from 'react';
import { Text } from 'react-native';
import styled from 'styled-components';

const Wrapper = styled(Text)`
  background-color: red;
  display: flex;
  justify-content: center;
  align-content: center;
`;

export default class App extends React.Component {
  render() {
    return (
      <Wrapper>
        Yo
      </Wrapper>
    );
  }
}