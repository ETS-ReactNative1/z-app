import React, { Component } from 'react'
import {
	Form,
	FormText,
	FormGroup,
	Label,
	Input,
	Col,
	Row,
	Container,
	Button,
	Card,
	CardImg,
	CardText,
	CardBody,
	CardLink,
	CardTitle,
	CardSubtitle,
	Modal,
	ModalHeader,
	ModalBody
} from 'reactstrap'
import axios, { post } from 'axios'
import auth from '../../service/index'

export default class ModalEditLesson extends Component {
	constructor(props) {
		super(props)
		this.state = {
			file: null,
			file_video: null,
			file_sheet: null,
			file_picture: null,
			idLesson: '',
			titleLesson: '',
			detailLesson: '',
			data: [],
			editlesson: false,
			open: true,
			IdToPathProfileLesson: '',
			pathVideoLesson: '',
			id: ''
		}
		this.videoUpload = this.videoUpload.bind(this)
		this.sheetUpload = this.sheetUpload.bind(this)
		this.sentData = this.sentData.bind(this)
		this.upload = this.upload.bind(this)
	}
	toggle = () => {
		this.setState({ open: !this.state.open })
		this.props.onClose()
	}

	handleInputChange = e => {
		const { name, value } = e.target
		this.setState({ [name]: value })
		this.setState({ message: '' })
		console.log({ [name]: value })
	}

	onChangeVideo = e => {
		this.setState({ file_video: e.target.files[0] })
	}
	onChangeFile = e => {
		this.setState({ file_sheet: e.target.files[0] })
	}

	videoUpload(file) {
		const url = 'http://localhost:3013/z-api/lesson/UploadVideoCourse'
		const formData = new FormData()
		// formData.append('file', file)
		formData.append('videoData', file)
		const config = {
			headers: {
				'content-type': 'multipart/form-data'
			}
		}
		return post(url, formData, config)
	}

	sheetUpload(file) {
		const url = 'http://localhost:3013/z-api/lesson/UploadFileCourse'
		const formData = new FormData()
		// formData.append('file', file)
		formData.append('fileData', file)
		const config = {
			headers: {
				'content-type': 'multipart/form-data'
			}
		}
		return post(url, formData, config)
	}

	getData = () => {
		let user = auth.getToken()
		let userDecoded = auth.decodeToken(user)
		let uId = userDecoded.id
		console.log('course id : ', this.props.id)

		axios.get(`http://localhost:3013/z-api/lesson/${this.props.id}`).then(res => {
			const { data } = res
			console.log('DATA Lesson = ', data)
			this.setState({ idLesson: data.id, titleLesson: data.titleLesson, detailLesson: data.detailLesson })
		})
	}
	async sentData(e) {
		console.log(' add ! ')
		e.preventDefault()
		let user = auth.getToken()
		let userDecode = auth.decodeToken(user)
		let uId = userDecode.id
		let uEmail = userDecode.email
		try {
			const data = {
				id: this.state.idLesson,
				titleLesson: this.state.titleLesson,
				detailLesson: this.state.detailLesson,
				userId: uId,
				courseId: this.props.idC
			}
			console.log('data  = = =', data)

			await axios.post(`http://localhost:3013/z-api/lesson/`, data).then($res => {
				const { data } = $res
				console.log('data lesson is ', data)
				this.setState({ IdToPathProfileLesson: data.id })
			})

			console.log('-----------uploading------------')
			await this.upload().then(this.toggle()) // await this.upload().then(this.props.history.push(`/overview`))
			console.log('-----------uploaded------------')
		} catch (error) {
			console.log('sent error')
		}
	}

	async upload() {
		await this.videoUpload(this.state.file_video).then(response => {
			console.log('res . data : ', response.data)
			const dataPic = {
				id: this.state.IdToPathProfileLesson,
				pathVideoLesson: response.data.file.path
			}

			axios.post(`http://localhost:3013/z-api/lesson/SavePathVideoCourse`, dataPic).then($res => {
				const { data } = $res
				console.log('what is the path : ', data)
			})
		})

		await this.sheetUpload(this.state.file_sheet).then(response => {
			console.log('res . data : ', response.data)
			const data = {
				id: this.state.IdToPathProfileLesson,
				pathFile: response.data.file.path
			}

			axios.post(`http://localhost:3013/z-api/lesson/SavePathFileCourse`, data).then($res => {
				const { data } = $res
				console.log('what is the path : ', data)
			})
		})
	}
	componentDidMount() {
		console.log('prop id ', this.props.id)
		this.getData(this.props.id)
	}

	render() {
		const { onClose, id, getData,idC } = this.props
		return (
			<div>
				<Modal style={{ fontSize: '1rem' }} size="lg" isOpen={this.state.open} toggle={onClose}>
					<ModalHeader toggle={onClose}>
						<div className="title">Edit Lesson</div>
					</ModalHeader>

					<ModalBody>
						<Container className="">
							{/* <Row> */}
							<Col md={12}>
								<Col md={12} className="TextNewAddCourse">
									Edit Your Lesson
								</Col>

								<Form onSubmit={this.sentData}>
									<div>
										<Row md={12} className="mt-3 mb-3">
											<Col md={4} className="">
												??????????????????????????????????????????????????????
											</Col>
											<Col md={8}>
												<div className="d-flex">
													<input
														style={{ fontSize: '8px !important' }}
														name="titleLesson"
														className="InputAddCourse"
														type="text"
														placeholder="???????????????????????????????????????????????????"
														onChange={this.handleInputChange}
														value={this.state.titleLesson}
														// invalid={String(this.state.invalidemail)}
														required
													/>
												</div>
											</Col>
										</Row>

										<Row md={12} className="mt-3 mb-3">
											<Col md={4} className="">
												??????????????????????????????????????????????????????????????????????????????
											</Col>
											<Col md={8}>
												<div className="d-flex">
													<textarea
														style={{ fontSize: '8px !important' }}
														name="detailLesson"
														className="InputAddCourse"
														style={{ height: '150px' }}
														type="text"
														placeholder="????????????????????????????????????????????????????????????"
														onChange={this.handleInputChange}
														value={this.state.detailLesson}
														// invalid={String(this.state.invalidemail)}
														required
													/>
												</div>
											</Col>
										</Row>

										<Row className="upVideo" md={12}>
											<Col md={4} className="TextAddCourse">
												?????????????????????????????????
											</Col>
											<Col>
												<Input type="file" name="file_video" id="exampleFile2" onChange={this.onChangeVideo} multiple />
												<FormText color="muted">??????????????????????????????????????????????????????????????????????????????????????????</FormText>
											</Col>
										</Row>

										<Row className="upVideo" md={12}>
											<Col md={4} className="TextAddCourse">
												???????????????????????????????????????????????????????????????
											</Col>
											<Col>
												<Input type="file" name="file_sheet" id="exampleFile3" onChange={this.onChangeFile} multiple />
												<FormText color="muted">??????????????????????????????????????????????????????????????????????????????????????????</FormText>
											</Col>
										</Row>
										{/* <FormGroup className="upSheet">
											<Label for="exampleFile">Choose Your Sheet</Label>
											<Input type="file" name="fil_sheet" id="exampleFile" onChange={this.onChangeSheet} />
											<FormText color="muted">??????????????????????????????????????????????????????????????????????????????????????????</FormText>
										</FormGroup> */}
									</div>
									<div className="btn-mid">
										<Button className="submitAddCourse" size="lg">
											Confirm
										</Button>
									</div>
								</Form>
							</Col>
						</Container>
					</ModalBody>
				</Modal>
			</div>
		)
	}
}
