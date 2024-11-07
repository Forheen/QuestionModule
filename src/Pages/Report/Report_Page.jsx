import React from 'react';
import AppDrawer from '../../components/AppDrawer';
import { useState } from 'react';

export default function Report_Page() {
    const [state,setState]=useState(false)
  return (
    <>
    <div>Report_Page</div>
    <AppDrawer onChange={setState} />
    </>
  )
}
