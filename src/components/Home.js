import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Header from './Header';
import { MuiThemeProvider, CssBaseline } from "@material-ui/core";
import theme from "../theme/theme";
import StudentsTeachersTable from "./StudentsTeachersTable"
import Homeworks from "./Homeworks"
import { serverConfig } from '../config';
import Sidebar from './Sidebar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import mainImage from '../images/main.jpg';
import mainTeacher from '../images/mainTeacher.jpg';
import AddClassWindow from './AddClassWindow';
import Button from '@material-ui/core/Button';

const TEACHER = 'teacher'
const STUDENT = 'student'

const TEACHER_BUTTONS_CONTROLLER = [2, 3, 0]
const STUDENT_BUTTONS_CONTROLLER = [3, 0]

const useStyles = makeStyles((theme) => ({
	body: {
		display: 'flex',
		flexDirection: 'row-reverse',
		zIndex: 2
	},
	toolbarTitle: {
		marginTop: 20,
		fontWeight: 'bold',
		fontSize: 40,
		zIndex: 2,
		fontFamily: 'system-ui',
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
	const [studentIdToName, setStudentIdToName] = useState([]);
	const [isTeacher, setIsTeacher] = useState(null);
	const [userId, setUserId] = useState('');
	const [username, setUsername] = useState('');
	const [classIds, setClassIds] = useState([]);
	const [addClassWindowOpen, setAddClassWindowOpen] = useState(false);

	const [sidebarController, setSidebarController] = useState(0);
	const [sidebarButtonsController, setSidebarButtonsController] = useState([]);

	const getClassesNamesList = (list) => {
		let listToString = ''
		try {
			let toList = JSON.parse(list)

			toList?.forEach(element => {
				listToString = listToString + classIdToName[element] + ', '
			});
		} catch (e) {
			console.log("🚀 ~ file: StudentsTeachersTable.js ~ line 82 ~ getClassesNamesList ~ e", e)
		}

		return listToString.substr(0, listToString.length - 2)
	}

	const setTableTypeOverated = (tableType) => {
		if (tableType == TEACHER) {
			setListData(teachersList)
			setTableTypeName('מורה')
		} else {
			setListData(studentsList)
			setTableTypeName('סטודנט')
		}
	}

	const getStudentsListByClassId = (classId) => {
		return studentsList.filter(s => {
			let list = JSON.parse(s.classIds)
			return !!list.includes(classId)
		})
	}

	const initAllClasses = () => {
		let queryC = serverConfig.url + '/classes'
		fetch(queryC, {
			method: 'get',
		})
			.then(response => response.json())
			.then(data => {
				console.log("🚀 ~ file: Home.js ~ line 95 ~ initAllClasses ~ data", data)
				let tempClassIdToName = {}

				data.classes.forEach(element => {
					let parsedElement = JSON.parse(element)
					tempClassIdToName[parsedElement.id] = parsedElement.className
				});
				console.log("🚀 ~ file: Home.js ~ line 101 ~ initAllClasses ~ tempClassIdToName", tempClassIdToName)

				setClassIdToName({ ...tempClassIdToName })
			})
			.catch(err => {
				console.error("TCL: registerLogic -> err", err)
			})
	}

	useEffect(function () {
		console.log('useEffect')

		// init user profil
		let isTeacher = sessionStorage.getItem('isTeacher');
		let userId = sessionStorage.getItem('userId');
		let username = sessionStorage.getItem('username');
		let classIds = sessionStorage.getItem('classIds');

		setIsTeacher(isTeacher === 'true')
		setUserId(userId)

		let objJsonClassIds = JSON.parse(classIds)
		objJsonClassIds = JSON.parse(objJsonClassIds)

		setClassIds(objJsonClassIds)
		setUsername(username.substr(1, username.length - 2))

		let tempTableType = isTeacher == 'true' ? TEACHER : STUDENT;
		let tempSidebarButtonsController = isTeacher == 'true' ? TEACHER_BUTTONS_CONTROLLER : STUDENT_BUTTONS_CONTROLLER;

		setTableType(tempTableType)
		setSidebarButtonsController(tempSidebarButtonsController)
		console.log("🚀 ~ file: Home.js ~ line 109 ~ objJsonClassIds", objJsonClassIds)

		// get all data
		let queryS = serverConfig.url + '/student'
		fetch(queryS, {
			method: 'get',
		})
			.then(response => response.json())
			.then(data => {
				let tempStudentsList = []
				let tempStudentIdToName = {}

				data.students.forEach(element => {
					let classIdsOfStudent = JSON.parse(element.classIds)

					for (let i in classIdsOfStudent) {
						if (objJsonClassIds.includes(classIdsOfStudent[i])) {
							tempStudentsList.push(element)
							tempStudentIdToName[element.id] = element.name + ' ' + element.lastName
							break
						}
					}
				});

				setStudentsList(tempStudentsList)
				setListData(tempStudentsList)
				setStudentIdToName(tempStudentIdToName)
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

		initAllClasses()
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
				<img alt="main" src={isTeacher ? mainTeacher : mainImage} style={{ position: 'absolute', width: '100%', opacity: 0.3, marginTop: -20, marginRight: -20, objectFit: 'fill', height: '101vw' }} />
				<CssBaseline />
				<Header title="מערכת בדיקות" />
				<div className={classes.body}>
					<Sidebar setSidebarController={setSidebarController} setTableType={setTableTypeOverated} sidebarButtonsController={sidebarButtonsController} />
					{
						sidebarController == 0 &&
						<div className={classes.toolbarTitle} style={{ display: 'flex', flexDirection: 'column', width: '100%' }} >
							<br />
							<Typography
								component="h2"
								variant="h5"
								color="inherit"
								align="center"
								noWrap
								className={classes.toolbarTitle}
							>
								ברוך הבא  -  {username}!
							</Typography>
							<br />
							<br />
							<Divider style={{ width: '80%', alignSelf: 'center', height: 4, borderRadius: 5 }} />
							<Typography
								component="h2"
								variant="h5"
								color="inherit"
								align="center"
								noWrap
								className={classes.toolbarTitle}
								style={{ whiteSpace: 'pre-line', fontSize: 30, color: '#56585a' }}
							>
								{
									isTeacher ?
										"הנך מורה בקורס:"
										:
										"הנך תלמיד בקורסים:"
								}
							</Typography>
							<React.Fragment>
								{
									classIds.length > 0 &&
									classIds.map((c, index) => {
										return <Typography
											key={`${c}-${index}`}
											component="h2"
											variant="h5"
											align="center"
											noWrap
											className={classes.toolbarTitle}
											style={{ whiteSpace: 'pre-line', fontSize: 24, width: 400, alignSelf: 'center', color: '#353535' }}
										>
											{classIdToName[c]}
										</Typography>
									})
								}
							</React.Fragment>
							<br />
							{
								isTeacher &&
								<Button onClick={() => setAddClassWindowOpen(true)} variant="contained" color="primary" style={{ alignSelf: 'center', width: 120 }}>
									הוספת קורס
								</Button>
							}
							<br />
						</div>
					}
					{
						(sidebarController == 1 || sidebarController == 2) && listData &&
						<StudentsTeachersTable tableTypeName={tableTypeName} listData={listData} classIdToName={classIdToName} getClassesNamesList={getClassesNamesList} />
					}
					{
						sidebarController == 3 && listData &&
						<Homeworks
							classIdToName={classIdToName}
							isTeacher={isTeacher}
							userId={userId}
							classIds={classIds}
							getStudentsListByClassId={getStudentsListByClassId}
							studentIdToName={studentIdToName}
						/>
					}
					{addClassWindowOpen &&
						<AddClassWindow
							open={addClassWindowOpen}
							onClose={() => {
								setAddClassWindowOpen(false)
								console.log('onClose')
							}}
							stayOpened={() => {
								setAddClassWindowOpen(true)
								console.log('stayOpened')
							}}

							classIdToName={classIdToName}
							classIds={classIds}
							teacherId={userId}
							initAllClasses={initAllClasses}
							setClassIds={setClassIds}
						/>
					}
				</div>
			</MuiThemeProvider>
		</React.Fragment>
	);

}
