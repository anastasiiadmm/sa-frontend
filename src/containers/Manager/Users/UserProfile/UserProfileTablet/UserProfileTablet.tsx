import React from 'react';
import { useParams } from "react-router-dom";

const UserProfileTablet = () => {
  const { id } = useParams() as { id: string };
  console.log(id);
  return <div>UserProfileTablet</div>;
};

export default UserProfileTablet;
