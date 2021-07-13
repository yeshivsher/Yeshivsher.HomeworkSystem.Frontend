import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Header from './Header';
import { MuiThemeProvider, CssBaseline } from "@material-ui/core";
import theme from "../theme/theme";
import StudentsTeachersTable from "./StudentsTeachersTable"
import Homeworks from "./Homeworks"
import { serverConfig } from '../config';
import Sidebar from './Sidebar';

const TEACHER = 'teacher'
const STUDENT = 'student'

const TEACHER_BUTTONS_CONTROLLER = [1, 2, 3, 4]
const STUDENT_BUTTONS_CONTROLLER = [2, 3, 4]

const useStyles = makeStyles((theme) => ({
	body: {
		display: 'flex',
		flexDirection: 'row-reverse'
	},
}));

export default function Home() {
	const classes = useStyles();
	const [studentsList, setStudentsList] = useState([]);
	const [teachersList, setTeachersList] = useState([]);
	const [tableTypeName, setTableTypeName] = useState('מורה');
	const [tableType, setTableType] = useState(TEACHER);
	const [listData, setListData] = useState([]);
	const [classIdToName, setClassIdToName] = useState([]);
	const [isTeacher, setIsTeacher] = useState([]);
	const [userId, setUserId] = useState([]);

	const [sidebarController, setSidebarController] = useState(1);
	const [sidebarButtonsController, setSidebarButtonsController] = useState([]);

	const setTableTypeOverated = (tableType) => {
		if (tableType == TEACHER) {
			setListData(teachersList)
			setTableTypeName('מורה')
		} else {
			setListData(studentsList)
			setTableTypeName('סטודנט')
		}
	}

	useEffect(function () {
		console.log('useEffect')

		// init user profil
		let isTeacher = sessionStorage.getItem('isTeacher');
		let userId = sessionStorage.getItem('userId');
		console.log("🚀 ~ file: Home.js ~ line 54 ~ userId", userId)

		setIsTeacher(isTeacher === 'true')
		setUserId(userId)

		let tempTableType = isTeacher == 'true' ? TEACHER : STUDENT;
		let tempSidebarButtonsController = isTeacher == 'true' ? TEACHER_BUTTONS_CONTROLLER : STUDENT_BUTTONS_CONTROLLER;

		setTableType(tempTableType)
		setSidebarButtonsController(tempSidebarButtonsController)

		// get all data
		let queryS = serverConfig.url + '/student'
		fetch(queryS, {
			method: 'get',
		})
			.then(response => response.json())
			.then(data => {
				console.log("🚀 ~ file: Home.js ~ line 72 ~ data", data)
				let tempStudentsList = []

				data.students.forEach(element => {
					tempStudentsList.push(element)
				});

				setStudentsList(tempStudentsList)
				setListData(tempStudentsList)
			})
			.catch(err => {
				console.error("TCL: registerLogic -> err", err)
			})

		let queryT = serverConfig.url + '/teacher'
		fetch(queryT, {
			method: 'get',
		})
			.then(response => response.json())
			.then(data => {
				let tempTeachersList = []

				data.teachers.forEach(element => {
					tempTeachersList.push(JSON.parse(element))
				});

				setTeachersList(tempTeachersList)
			})
			.catch(err => {
				console.error("TCL: registerLogic -> err", err)
			})

		let queryC = serverConfig.url + '/classes'
		fetch(queryC, {
			method: 'get',
		})
			.then(response => response.json())
			.then(data => {
				let tempClassIdToName = {}

				data.classes.forEach(element => {
					let parsedElement = JSON.parse(element)
					tempClassIdToName[parsedElement.id] = parsedElement.className
				});

				setClassIdToName(tempClassIdToName)
			})
			.catch(err => {
				console.error("TCL: registerLogic -> err", err)
			})
	}, [])
	useEffect(function () {
		console.log('useEffect 2 ')

		if (tableType == TEACHER) {
			setListData(teachersList)
			setTableTypeName('מורה')
		} else {
			setListData(studentsList)
			setTableTypeName('סטודנט')
		}
	}, [teachersList, studentsList])

	return (
		<React.Fragment>
			<MuiThemeProvider theme={theme}>
				<CssBaseline />
				<Header title="מערכת בדיקות" />
				<div className={classes.body}>
					<Sidebar setSidebarController={setSidebarController} setTableType={setTableTypeOverated} sidebarButtonsController={sidebarButtonsController} />
					{
						sidebarController == 0 &&
						<p>אין מה להציג</p>
					}
					{
						(sidebarController == 1 || sidebarController == 2) && listData &&
						<StudentsTeachersTable tableTypeName={tableTypeName} listData={listData} classIdToName={classIdToName} />
					}
					{
						sidebarController == 3 && listData &&
						<Homeworks classIdToName={classIdToName} isTeacher={isTeacher} userId={userId} />
					}
				</div>
			</MuiThemeProvider>
		</React.Fragment>
	);

}
