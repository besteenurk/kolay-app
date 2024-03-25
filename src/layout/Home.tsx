import React, { Component } from 'react';
import Grid from "@mui/material/Grid";
import "./Home.css"
import CreateForm from '../components/CreateForm';
import DataTable from '../components/DataTable';

export default function Home() {
    return (
        <section>
            <div className="createWrapper">
                <CreateForm />
            </div>

            <div className="bodyWrapper">
                <DataTable />
            </div>
        </section>
    )
}