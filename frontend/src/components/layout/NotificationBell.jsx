import { useState } from 'react';
import { Badge, Dropdown, List, Avatar, Typography, Button, Space } from 'antd';
import { useEffect, useRef } from 'react';
import { BellOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { notificationsData } from '../../data/notifications';

const { Text } = Typography;

const NotificationBell = () => {
  const [notifications, setNotifications] = useState(notificationsData);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const markRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };
  const menuItems = [
    {
      key: 'list',
      label: (
        <List
          size="small"
          dataSource={notifications.slice(0, 5)}
          renderItem={item => (
            <List.Item
              onClick={() => markRead(item.id)}
              style={{ cursor: 'pointer', padding: '8px 0' }}
            >
              <List.Item.Meta
              avatar={<Avatar style={{ background: item.type === 'overdue' ? '#ff4d4f' : '#faad14' }}>
                {item.icon === 'clock' ? '⏰' : item.icon === 'warning' ? '⚠️' : '🚨'}
              </Avatar>}
              title={<Text strong>{item.title}</Text>}
              description={<Space><Text type="secondary">{item.content}</Text><Text type="secondary" style={{ fontSize: '12px' }}>{item.time}</Text></Space>}
            />
            {!item.read && <CheckCircleOutlined style={{ color: '#52c41a' }} />}
          </List.Item>
        )}
        loadMore={notifications.length > 5 && (
          <div style={{ textAlign: 'center', margin: '16px 0' }}>
            <Button type="link" size="small">Xem tất cả</Button>
          </div>
        )}
      />
    )
  }];

  return (
    <>
      <Badge count={unreadCount > 99 ? '99+' : unreadCount} offset={[-10, 10]}>
        <div 
          style={{ cursor: 'pointer', padding: '8px', fontSize: '20px' }}
          onClick={() => setOpen(!open)}
        >
          <BellOutlined />
        </div>
      </Badge>
      {open && (
        <div ref={dropdownRef} className="notification-dropdown" style={{
          position: 'fixed',
          top: '70px',
          right: '20px',
          zIndex: 1000,
          width: 400,
          background: 'white',
          border: '1px solid #d9d9d9',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          maxHeight: '400px',
          overflow: 'auto'
        }}>
          <List
            size="small"
            header={<div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
              <Text strong style={{ marginRight: 8 }}>Thông báo</Text>
              <span style={{ color: '#999', fontSize: '12px' }}>{unreadCount} chưa đọc</span>
            </div>}
            footer={<div style={{ textAlign: 'center', padding: '8px' }}>
              <Button type="link">Xem tất cả thông báo</Button>
            </div>}
            dataSource={notifications.slice(0, 5)}
            renderItem={item => (
                <List.Item
                  key={item.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    markRead(item.id);
                    window.location.href = item.link;
                  }}
                >
                <List.Item.Meta
                  avatar={<Avatar style={{ background: item.type === 'overdue' ? '#ff4d4f' : item.type === 'health' ? '#faad14' : '#52c41a' }}>
                    {item.icon === 'clock' ? '⏰' : '⚠️'}
                  </Avatar>}
                  title={<Text strong>{item.title}</Text>}
                  description={<Space direction="vertical" size={0}>
                    <Text type="secondary">{item.content}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{item.time}</Text>
                  </Space>}
                />
                {!item.read && <CheckCircleOutlined style={{ color: '#52c41a' }} />}
              </List.Item>
            )}
          />
        </div>
      )}
    </>
  );
};

export default NotificationBell;

