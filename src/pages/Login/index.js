import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "@/components/NavBar";
import styles from "./index.module.scss";
import { useFormik } from "formik";
import Input from "@/components/Input";
import * as Yup from "yup";
import classnames from "classnames";
import { useDispatch } from "react-redux";
import { sendValidationCode, login } from "@/store/actions/login";
import { Toast } from "antd-mobile";

export default function Login() {
	const navigate = useNavigate();
	// 获取路由信息 location 对象
	const location = useLocation();
	// ...
	// Formik 表单对象
	const form = useFormik({
		// 设置表单字段的初始值
		initialValues: {
			mobile: "13900001111",
			code: "246810",
		},
		// 提交
		async onSubmit(values) {
			await dispatch(login(values));

			// 登录后进行页面跳转
			const { state } = location;
			if (!state) {
				// 如果不是从其他页面跳到的登录页，则登录后默认进入首页
				navigate("/");
			} else {
				// 否则跳回到之前访问的页面
				navigate(state.from);
			}
			Toast.show({
				icon: "success",
				content: "登录成功",
			});
		},
		validate(values) {
			const errors = {};
			if (!values.mobile) {
				errors.mobile = "手机号不能为空";
			}
			if (!values.code) {
				errors.code = "验证码不能为空";
			}
			return errors;
		},
		// 表单验证
		validationSchema: Yup.object().shape({
			// 手机号验证规则
			mobile: Yup.string()
				.required("请输入手机号")
				.matches(/^1[3456789]\d{9}$/, "手机号格式错误"),

			// 手机验证码验证规则
			code: Yup.string()
				.required("请输入验证码")
				.matches(/^\d{6}$/, "验证码6个数字"),
		}),
	});

	const {
		values: { mobile, code },
		handleChange,
		handleSubmit,
		handleBlur,

		errors,
		touched,
	} = form;

	// 获取 Redux 分发器
	const dispatch = useDispatch();

	// 发送短信验证码
	const [time, setTime] = useState(0);
	const sendSMSCode = async () => {
		if (time > 0) return;
		// 先对手机号进行验证
		if (!/^1[3-9]\d{9}$/.test(mobile)) {
			form.setTouched({
				mobile: true,
			});
			return;
		}
		try {
			await dispatch(sendValidationCode(mobile));
			Toast.show({
				icon: "success",
				content: "获取验证码成功",
			});

			// 开启倒计时
			setTime(60);
			let timeId = setInterval(() => {
				// 当我们每次都想要获取到最新的状态，需要写成 箭头函数的形式
				setTime((time) => {
					if (time === 1) {
						clearInterval(timeId);
					}
					return time - 1;
				});
			}, 1000);
		} catch (err) {
			if (err.response) {
				Toast.show({
					icon: "fail",
					content: err.response.data.message,
				});
			} else {
				Toast.show({
					content: "服务器繁忙，请稍后重试",
				});
			}
		}
	};
	return (
		<div className={styles.root}>
			<NavBar>登录</NavBar>
			<div className="content">
				{/* 标题 */}
				<h3>短信登录</h3>

				<form onSubmit={handleSubmit}>
					{/* 手机号输入框 */}
					<Input
						placeholder="请输入手机号"
						value={mobile}
						name="mobile"
						autoComplete="off"
						onChange={handleChange}
						onBlur={handleBlur}
					/>
					{touched.mobile && errors.mobile && (
						<div className="validate">{errors.mobile}</div>
					)}
					{/* 短信验证码输入框 */}
					<Input
						name="code"
						placeholder="请输入验证码"
						extra={time === 0 ? "获取验证码" : time + "s后获取"}
						maxLength={6}
						value={code}
						onChange={handleChange}
						onBlur={handleBlur}
						onExtraClick={sendSMSCode}
					/>
					{touched.code && errors.code && (
						<div className="validate">{errors.code}</div>
					)}
					{/* 登录按钮 */}
					<button
						type="submit"
						className={classnames(
							"login-btn",
							form.isValid ? "" : "disabled"
						)}
						disabled={!form.isValid}
					>
						登录
					</button>
				</form>
			</div>
		</div>
	);
}
