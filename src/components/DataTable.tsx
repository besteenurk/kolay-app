import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
    GridRowsProp,
    GridRowModesModel,
    GridRowModes,
    DataGrid,
    GridColDef,
    GridToolbarContainer,
    GridActionsCellItem,
    GridEventListener,
    GridRowId,
    GridRowModel,
    GridRowEditStopReasons,
    GridSlots, GridRenderCellParams,
} from '@mui/x-data-grid';
import {
    randomCreatedDate,
    randomTraderName,
    randomId,
    randomArrayItem,
} from '@mui/x-data-grid-generator';
import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { ITableTask, deleteTask, putTask, taskSelector } from '../storages/slices/taskSlice';
import { useAppDispatch, useAppSelector } from '../storages/tools/hook';

const roles = ['Market', 'Finance', 'Development'];
const randomRole = () => {
    return randomArrayItem(roles);
};

const initialRows: GridRowsProp = [
    {
        id: randomId(),
        name: randomTraderName(),
        age: 25,
        joinDate: randomCreatedDate(),
        role: randomRole(),
    },
    {
        id: randomId(),
        name: randomTraderName(),
        age: 36,
        joinDate: randomCreatedDate(),
        role: randomRole(),
    },
    {
        id: randomId(),
        name: randomTraderName(),
        age: 19,
        joinDate: randomCreatedDate(),
        role: randomRole(),
    },
    {
        id: randomId(),
        name: randomTraderName(),
        age: 28,
        joinDate: randomCreatedDate(),
        role: randomRole(),
    },
    {
        id: randomId(),
        name: randomTraderName(),
        age: 23,
        joinDate: randomCreatedDate(),
        role: randomRole(),
    },
];

interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
}

function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
        const id = randomId();
        setRows((oldRows) => [...oldRows, { id, name: '', code: '', assignDate: '', editable: false, isNew: true }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Add record
            </Button>
        </GridToolbarContainer>
    );
}
const renderEditableCell = (params: any, field: string) => {
    const { id, field: fieldName, value, api } = params;

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        api.setEditCellValue({ id, field: fieldName }, newValue);
    };

    return (
        <TextField
            fullWidth
            size="small"
            value={value}
            onChange={handleInputChange}
            inputProps={{
                pattern: field === 'type' ? '^\\w{2}\\d{3}$' : '^[a-zA-Z]*$',
                title: field === 'type' ? 'İlk iki harf kelime sonraki 3 karakter sayı olmalı' : 'Sadece harfler kabul edilir',
            }}
        />
    );
};


export default function DataTable() {
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

    const [tasks, setTasks] = useState<Array<ITableTask>>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [rows, setRows] = React.useState<GridRowsProp>(tasks);
    const selectedTask = useAppSelector(taskSelector);
    const dispatch = useAppDispatch();


    useEffect(() => {
        setLoading(selectedTask.loading);
        setError(selectedTask.error);
        setTasks(selectedTask.task);
        setRows(selectedTask.task)
    }, [selectedTask]);



    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id: GridRowId, data: any) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id: GridRowId) => () => {
        setRows(rows.filter((row) => row.id !== id));
        dispatch(deleteTask(rows.filter((row) => row.id === id)[0] as ITableTask));
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow: GridRowModel) => {
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        
        dispatch(putTask(newRow));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    function RatingEditInputCell(props: GridRenderCellParams<any>) {
        const { id, value, field } = props;


        const handleRef = (element: HTMLElement) => {
            if (element) {
                const input = element.querySelector(
                    `input[value="${value}"]`,
                ) as HTMLInputElement;
                input?.focus();
            }
        };
        const [name, setName] = useState("");
        const [nameError, setNameError] = useState(false);
        const handleNameChange = (e: any) => {
            setName(e.target.value);
            if (e.target.validity.valid) {
                setNameError(false);
            } else {
                setNameError(true);
            }
        };

        return (
            <TextField
                fullWidth
                size="small"
                value={value}
                inputProps={{
                    pattern: field === 'type' ? '^\\w{2}\\d{3}$' : '^[a-zA-Z]*$',
                    title: field === 'type' ? 'İlk iki harf kelime sonraki 3 karakter sayı olmalı' : 'Sadece harfler kabul edilir',
                }}
            />
        );
    }
    const renderRatingEditInputCell: GridColDef['renderEditCell'] = (params) => {
        return <RatingEditInputCell {...params} />;
    };


    const columns: GridColDef[] = [
        {
            field: 'id',
            editable: true,
            //renderCell: (params) => renderEditableCell(params, 'name'),
            headerName: 'ID', type: 'string', width: 180
        },
        {
            field: 'name',
            editable: true,
            //renderCell: (params) => renderEditableCell(params, 'name'),
            headerName: 'Name', type: 'string', width: 180
        },
        {
            field: 'code',
            headerName: 'Code',
            type: 'string',
            width: 80,
            editable: true,
            align: 'left',
            headerAlign: 'left'
        },
        {
            field: 'assignDate',
            headerName: 'Assign Date',
            type: 'string',
            width: 180,
            editable: true,
        },
        {
            field: 'editable',
            headerName: 'Is Updatable',
            width: 220,
            type: 'boolean',
            editable: true,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            editable: true,
            width: 150,
            cellClassName: 'actions',
            renderCell: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                const data = tasks?.filter((val) => val.id === id)[0];

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(id, data)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        disabled={!tasks.filter((val: any) => val.id === id)[0].editable}
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    return (
        <Box
            sx={{
                height: 500,
                width: '100%',
                '& .MuiDataGrid-row': {
                    bgcolor: (theme) =>
                        theme.palette.mode === 'dark' ? '#D3D3D3' : '#D3D3D3',
                },
                '& .MuiDataGrid-cell--editable': {
                    bgcolor: (theme) =>
                        theme.palette.mode === 'dark' ? '#fff' : '#fff',
                },
            }}
        >
            <DataGrid
                rows={rows}
                columns={columns}
                isRowSelectable={(params) => params.row.editable}
                isCellEditable={(params) => params.row.editable}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slotProps={{
                    toolbar: { setRows, setRowModesModel },
                }}
            />
        </Box>
    );
}
