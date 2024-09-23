import axios from "axios";
import React, { useState } from "react";
import styled from "styled-components";
import fileSaver from 'file-saver';

function App() {
  const [area, setArea] = useState("서울");
  const [places, setPlaces] = useState("경복궁");
  const [date, setDate] = useState(1);

  const onChangeArea = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArea(e.target.value);
  };

  const onChangePlace = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaces(e.target.value);
  };

  const onChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.value <= "0"){
      setDate(1);
    } else {
      setDate(Number(e.target.value));
    }
  };

  const getFileNameFromContentDisposition = (encodedText: string) => {
    let decodedText = decodeURI(encodedText);
    decodedText = decodedText.replace(' ', '');
    decodedText = decodedText.replace('attachment;filename=', '');
    return decodedText;
  };

  const generateExcel = async (area:string, places:string, date:number): Promise<void> => {
    console.log("come");
    
    await axios.post('http://localhost:3001/oyo/excel', {
      area: area,
      places: places,
      travelTime: date,
    }, { responseType: 'blob' }
    ).then((res) => {
      console.log(res.data);
      
      const blob = new Blob([res.data], {
        type: res.headers['content-type'],
      });
      const fileName = res.headers['content'];
      fileSaver.saveAs(blob, getFileNameFromContentDisposition(fileName));
    }).catch((err) => {
      console.log("요청 실패");
      console.log(err);
    });
  }

  return (
    <Main>
      <Div>
        <Text>여행 떠날 지역 : </Text>
        <InputField type="text" name="area" value={area} onChange={onChangeArea}></InputField>
      </Div>

      <Div>
        <Text>그 지역에서 꼭 가고 싶은 곳 : ,(쉼표)로 표시해주세요</Text>
        <InputField type="text" name="places" value={places} onChange={onChangePlace}></InputField>
      </Div>

      <Div>
        <Text>여행 일 수 :</Text>
        <InputField type="number" name="date" value={date} onChange={onChangeDate}></InputField>
      </Div>

      <SubmitButton onClick={() => {generateExcel(area, places, date)}}>생성하기</SubmitButton>
    </Main>
  );
}

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  gap: 20px;
  width: 400px;
`;

const Text = styled.p``

const Div = styled.div`
  display: flex
`;

const InputField = styled.input`
  display: flex;
`;

const SubmitButton = styled.button`
  display: flex;
  padding: 20px;
  justify-self: center;
  align-self: center;
`

export default App;