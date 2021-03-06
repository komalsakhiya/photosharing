import React from 'react';
import {MDCFormField} from '@material/form-field';
import {MDCTextField} from '@material/textfield';
import * as mdc from 'material-components-web';
import "material-components-web/dist/material-components-web.min.css";
import './login.css';
import { Link } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import config1 from '../config.json';
import Config from '../config.js';
import axios from 'axios';
import Home from '../home/home.js'
import { Redirect ,browserHistory } from 'react-router';

let config = new Config();


export default class Login extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			isAuthenticated: false,
			user: null,
			token: '',
			email: "",
			password:""
		};
		this.onChange = this.onChange.bind(this)
		this.logout = () => {
			this.setState({isAuthenticated: false, token: '', user: null})
		};

		this.responseFacebook = response =>{
			console.log(response);

			const tokenBlob = new Blob([JSON.stringify({access_token: response.accessToken}, null, 2)], {type : 'application/json'});
			const options = {
				method: 'POST',
				body: tokenBlob,
				mode: 'cors',
				cache: 'default'
			};
			// console.log("tokenBlob",response)
			axios.post(config.getBaseUrl()+ "user/facebooklogin",response).then(r => {
				console.log("response===============>",r.data
					)
				console.log("login successfull");
				localStorage.setItem('Login', true);
				localStorage.setItem('curruntUser', JSON.stringify(response));
				this.props.history.push("/Home");
				

				});
			}

			// this.setState = ({
				// 	isAuthenticated : true,
				// 	userId:response.userId,
				// 	name:response.name,
				// 	email:response.email,
				// 	picture:response.picture.data.url
				// });

			// }
			this.responseGoogle = response =>{
				console.log(response);
			} 
			this.onFailure = (error) => {
				alert(error);
			}
			this.componentClicked  = () => console.log("clicked")

		}

		onChange(e){
			this.setState ({
				[e.target.name]: e.target.value
			})
		}

		render() {
			let fbContent;
			let googleContent;

			if(this.state.isAuthenticated){
				console.log(this.state.isAuthenticated)
				fbContent = (
					<div class="user_details">
					<img src={this.state.picture} alt={this.state.name} />
					<h2>Welcome {this.state.name}</h2>
					<div>
					<button onClick={this.logout} className="button">
					Log out
					</button>
					</div>
					</div>
					)
			}else{
				fbContent = (
					<div>
					<FacebookLogin
					appId={config1.FACEBOOK_APP_ID}
					autoLoad={false}
					fields="name,email,picture"
					onClick={this.componentClicked}
					callback={this.responseFacebook} />
					</div>
					);
					googleContent = (
					<div>
					<GoogleLogin
					clientId= {config1.GOOGLE_CLIENT_ID}
					buttonText="Login With Google"
					onSuccess={this.responseGoogle}
					onFailure={this.onFailure}
					cookiePolicy={'single_host_origin'}/>
					</div>
					);
				}
				return (
				<div>
				<div className="mdc-card" >
				<center><h1>Login</h1></center>


				<div className="mdc-text-field">
				<input type="email" id="my-text-field" className="mdc-text-field__input" name="email" value={this.state.email}  onChange={this.onChange} />
				<label className="mdc-floating-label" htmlFor="my-text-field">Email</label>
				<div className="mdc-line-ripple"></div>
				</div>

				<div className="mdc-text-field">
				<input type="password" id="my-text-field" className="mdc-text-field__input" name="password" value={this.state.password}  onChange={this.onChange}/>
				<label className="mdc-floating-label" htmlFor="my-text-field">Password</label>
				<div className="mdc-line-ripple"></div>
				</div>

				<button className="mdc-button btn1" onClick={(event)=>this.handleClick(event)}>
				<span className="mdc-button__label">Login</span>
				</button>
				<div className="google_btn btn1">
				{fbContent}
				</div>
				<div className="google_btn btn1">
				{googleContent}
				</div>

				</div>

				</div>
				)
			}


			handleClick(event){
				console.log('event=============================>',event);
				console.log(this.setState)
				var apiBaseUrl = config.getBaseUrl() + "user/login";
			// var self = this;
			var payload={
				"email":this.state.email,
				"password":this.state.password
			}
			console.log(payload)

			axios.post(apiBaseUrl, payload)
			.then(function (response) {
				console.log("hii    ",response);
				// alert("Register successfull")
				console.log("login successfull");
				localStorage.setItem('Login', true);
				localStorage.setItem('curruntUser', JSON.stringify(response));
				this.props.history.push("/Home");
				// <Redirect to='./display'/>
			},function(err){
				console.log(err);

			})
		}
	}
