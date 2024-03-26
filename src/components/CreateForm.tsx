import React, { useEffect, useState } from 'react';
import { useForm, Controller, SubmitHandler, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import { Tooltip } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { ITableTask, addTask, taskSelector } from '../storages/slices/taskSlice';
import { useAppDispatch, useAppSelector } from '../storages/tools/hook';
import "./Form.css";

interface FormData {
    code: string;
    name: string;
    assignDate: any;
    editable: boolean;
}

const locales = ['tr'];
type LocaleKey = (typeof locales)[number];

const schema = yup.object().shape({
    code: yup.string().required('Code is required').matches(/^[a-zA-Z]{2}\d{3}$/, 'Invalid pattern'),
    name: yup.string().required('Name is required').matches(/[a-zA-ZığüşöçİĞÜŞÖÇ]+/, 'Invalid pattern').max(12, 'Name must be exactly max 12 characters'),
    assignDate: yup.date().required('Date is required'),
    editable: yup.boolean(),
});

const CreateForm: React.FC = () => {
    const [locale, setLocale] = React.useState<LocaleKey>('en');
    const today = new Date();
    const dispatch = useAppDispatch();

    const [tasks, setTasks] = useState<Array<ITableTask>>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const selectedTask = useAppSelector(taskSelector);

    useEffect(() => {
        setLoading(selectedTask.loading);
        setError(selectedTask.error);
        setTasks(selectedTask.task);
    }, [selectedTask]);

    const { control, handleSubmit, formState: { errors }, register } = useForm<FormData>({
        resolver: yupResolver(schema) as Resolver<FormData>,
    });

    const lastId = tasks[tasks.length - 1]?.id ? tasks[tasks.length - 1]?.id + 1 : 1;

    const onSubmit: SubmitHandler<FormData> = (data) => {
        const newTask = {
            id: lastId ? lastId : 1,
            name: data.name,
            code: data.code,
            assignDate: data.assignDate,
            editable: data.editable,
        };
        dispatch(addTask(newTask))
    };

    return (
        <div>
            <Box
                sx={{
                    paddingTop: 20,
                    height: 500,
                    width: '100%',
                    '& .actions': {
                        color: 'text.secondary',
                    },
                    '& .textPrimary': {
                        color: 'text.primary',
                    },
                }}
            >
                <form onSubmit={handleSubmit(onSubmit)} className='formWrapper'>
                    <Controller
                        name="code"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Tooltip title='First 2 character letters,
                            last 3 characters digit' arrow>
                                <TextField
                                    {...field}
                                    label="Code"
                                    fullWidth
                                    error={!!errors.code}
                                    helperText={errors.code?.message}
                                />
                            </Tooltip>
                        )}
                    />
                    <Controller
                        name="name"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Tooltip title='Max 12 character' arrow>
                                <TextField
                                    {...field}
                                    label="Name"
                                    fullWidth
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />
                            </Tooltip>
                        )}
                    />
                    <Controller
                        name="assignDate"
                        control={control}
                        defaultValue={today}
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
                                <DatePicker onChange={onChange} label="Date" defaultValue={dayjs(today)} format="DD/MM/YYYY" />
                            </LocalizationProvider>
                        )}
                    />
                    <Controller
                        name="editable"
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                            <FormControlLabel
                                control={<Checkbox {...field} />}
                                label="Is Updatable"
                            />
                        )}
                    />
                    {errors.editable && <span style={{ color: 'red' }}>Required</span>}
                    <button type="submit">Save</button>
                </form>
            </Box>
        </div>

    );
};

export default CreateForm;

