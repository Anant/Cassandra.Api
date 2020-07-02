import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';

import {
    PagingState,
    IntegratedPaging,
    SortingState,
    IntegratedSorting,
    DataTypeProvider,
    EditingState
} from '@devexpress/dx-react-grid';
import {
    Grid, Table, TableHeaderRow, PagingPanel, TableEditRow,
    TableEditColumn
} from '@devexpress/dx-react-grid-material-ui';

//DevExpress Plugin for column resizing
// import { TableColumnResizing } from '@devexpress/dx-react-grid-material-ui';

//Date column formatting
const DateFormatter = ({ value }) => (
    <b style={{ color: 'darkblue' }}>
        {new Date(value).toLocaleString('en-US')}
    </b>
);

const DateTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={DateFormatter}
        {...props}
    />
);

//URL column formatting
const UrlFormatter = ({ value }) => (
    <b style={{ color: 'darkblue' }}>
        {<a href={value} target="_blank">{value}</a>}
    </b>
);

const UrlTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={UrlFormatter}
        {...props}
    />
);

// Pic column formatting
const PicFormatter = ({ value }) => (
    <img src={value} style={{ height: '50px', width: "140px" }} alt="No Preview" />
);

const PicTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={PicFormatter}
        {...props}
    />
);

//Tags column formatting
const TagsFormatter = ({ value }) => (
    <div>
        {value.map((tag) => <p>{tag}</p>)}
    </div>
);

const TagsTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={TagsFormatter}
        {...props}
    />
);

//Our columns require [name, title], name is used to align object keys with columns, title is the column heading
const columns = [
    { name: 'title', title: 'Title' },
    { name: 'url', title: 'URL' },
    { name: 'created_at', title: "Created At" },
    { name: 'preview_picture', title: 'Preview Picture' },
    { name: 'domain_name', title: 'Domain' },
    { name: 'tags', title: 'Tags' },
];

const LeavesTable = () => {
    //Our Table data
    const [rows, setRows] = useState([]);

    //Runs similar to componentDidMount, set our table data
    useEffect(() => {
        getLeaves();
    }, []);

    //IDs of editing rows
    const [editingRowIds, setEditingRowIds] = useState([]);

    //Columns for custom formatting
    const [dateColumn] = useState(['created_at']);
    const [urlColumn] = useState(['url']);
    const [picColumn] = useState(['preview_picture']);
    const [tagsColumn] = useState(['tags']);


    //Our Row changes as we edit
    const [rowChanges, setRowChanges] = useState({});

    //This is out GET call to Cassandra.Api, Async
    async function getLeaves() {
        try {
            //Our Cassandra.Api endpoint
            let response = await fetch('http://localhost:8000/api/leaves');
            let data = await response.json();
            //Set state for table
            await setRows(data);
        } catch (error) {
            console.log(error);
        };
    };

    const commitChanges = async ({ changed, deleted }) => {
        //EDIT
        if (changed) {
            //Here we get the index of the row edited, this will be used to retrieve our data for the update
            let keysEdited = Object.keys(changed).map(Number);
            // console.log("ROWS EDITED", keysEdited)

            //Store the id of the leaf being edited
            let leafID = rows[keysEdited].id;
            // console.log("LEAF ID", leafID)

            //Checks for tags key in changes object at the rows index
            if (!!changed[keysEdited].tags) {
                //New tags are stored, split by commas
                let newTags = changed[keysEdited].tags.split(',');
                //trim each tag string
                for (let i = 0; i < newTags.length; i++) {
                    newTags[i] = newTags[i].trim();
                }
                // console.log("CHANGED", newTags);

                //Set our uniform tags back in req.body
                changed[keysEdited].tags = newTags;
            };

            //Update req cassandra.api, Req.body = changes, Refresh table
            await fetch(`http://localhost:8000/api/leaves/${leafID}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(changed[keysEdited]),
            }).then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    getLeaves();
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        };

        //DELETE
        if (deleted) {
            // console.log("DELETED",deleted)

            //In rows, get id of row to delete
            let deleteID = rows[deleted[0]].id
            // console.log("DELETE ID",deleteID)

            //DELETE request, refresh table after success
            fetch(`http://localhost:8000/api/leaves/${deleteID}`, {
                method: 'DELETE',
            }).then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    getLeaves();
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        };
    };

    //For column resizing
    // const columnWidths = [
    //     { columnName: 'title', width: 500 },
    //     { columnName: 'url', width: 175 },
    //     { columnName: 'created_at', width: 80 },
    //     { columnName: 'preview_picture', width: 150 },
    //     { columnName: 'domain_name', width: 150 },
    //     { columnName: 'tags', width: 100 },
    // ]

    return (
        <Paper>
            <Grid
                rows={rows}
                columns={columns}
            >
                <EditingState
                    editingRowIds={editingRowIds}
                    onEditingRowIdsChange={setEditingRowIds}
                    rowChanges={rowChanges}
                    onRowChangesChange={setRowChanges}
                    onCommitChanges={commitChanges}
                />
                <PagingState
                    pageSize={10}
                />
                <SortingState />
                <IntegratedPaging />
                <IntegratedSorting />
                <DateTypeProvider for={dateColumn} />
                <UrlTypeProvider for={urlColumn} />
                <PicTypeProvider for={picColumn} />
                <TagsTypeProvider for={tagsColumn} />
                <Table />
                {/* <TableColumnResizing columnWidths={columnWidths} /> */}
                <TableHeaderRow showSortingControls={true} />
                <TableEditRow />
                <TableEditColumn
                    showEditCommand
                    showDeleteCommand
                />
                <PagingPanel />
            </Grid>
        </Paper>
    );
}

export default LeavesTable;