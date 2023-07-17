import React from 'react';
import { useParams } from 'react-router-dom';

const UserProfileTablet = () => {
  const { id } = useParams() as { id: string };

  return <div></div>;
};

export default UserProfileTablet;
