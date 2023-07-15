import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Input, Avatar } from 'antd';
import { io } from 'socket.io-client';

interface IChatParam {
  id: number;
  name: string;
  type: string;
  message: string;
}

const Room = () => {
  const [socket] = useState(
    io('http://localhost:3001', {
      transports: ['websocket'],
    })
  );
  const [inputValue, setInputValue] = useState('');
  const [chatList, setChatList] = useState<IChatParam[]>([]);

  useEffect(() => {
    socket.on('message', (msg) => {
      setChatList((chatList) => [...chatList, msg]);
    });
  }, [socket]);

  const sendMessage = (id: number, name: string) => {
    socket.emit('message', {
      id,
      name,
      type: 'text',
      message: inputValue,
    });
    setInputValue('');
  };

  return (
    <div className="room">
      <div className="content">
        {chatList.map((item) => {
          return (
            <div className="chatItem">
              <span className="message">{item.message}</span>
              <Avatar>{item.name}</Avatar>
            </div>
          );
        })}
      </div>
      <Row gutter={12}>
        <Col span={20}>
          <Input
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            onPressEnter={() => sendMessage(1, 'Huang')}
          />
        </Col>
        <Col span={4}>
          <Button onClick={() => sendMessage(1, 'Huang')}>发送</Button>
        </Col>
      </Row>
    </div>
  );
};

export default Room;
