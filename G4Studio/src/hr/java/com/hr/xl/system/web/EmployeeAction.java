package com.hr.xl.system.web;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.g4studio.common.web.BaseAction;
import org.g4studio.common.web.BaseActionForm;
import org.g4studio.core.json.JsonHelper;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;
import org.g4studio.core.mvc.xstruts.action.ActionForm;
import org.g4studio.core.mvc.xstruts.action.ActionForward;
import org.g4studio.core.mvc.xstruts.action.ActionMapping;
import org.g4studio.core.util.G4Constants;
import org.g4studio.core.util.G4Utils;
import org.g4studio.system.admin.service.OrganizationService;
import org.g4studio.system.common.dao.vo.UserInfoVo;

import com.hr.xl.system.service.EmployeeService;

public class EmployeeAction extends BaseAction {

	private EmployeeService employeeService = (EmployeeService) super
			.getService("employeeService");
	private OrganizationService organizationService = (OrganizationService) super
			.getService("organizationService");

	public ActionForward emplInit(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		super.removeSessionAttribute(request, "deptid");
		Dto inDto = new BaseDto();
		String deptid = super.getSessionContainer(request).getUserInfo()
				.getDeptid();
		inDto.put("deptid", deptid);
		Dto outDto = organizationService.queryDeptinfoByDeptid(inDto);
		request.setAttribute("rootDeptid", outDto.getAsString("deptid"));
		request.setAttribute("rootDeptname", outDto.getAsString("deptname"));
		UserInfoVo userInfoVo = getSessionContainer(request).getUserInfo();
		request.setAttribute("login_account", userInfoVo.getAccount());
		return mapping.findForward("manageEmplView");
	}

	public ActionForward queryEmployeesForManage(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String deptid = request.getParameter("deptid");
		if (G4Utils.isNotEmpty(deptid)) {
			setSessionAttribute(request, "deptid", deptid);
		}
		if (!G4Utils.isEmpty(request.getParameter("firstload"))) {
			dto.put("deptid", super.getSessionContainer(request).getUserInfo()
					.getDeptid());
		} else {
			dto.put("deptid", super.getSessionAttribute(request, "deptid"));
		}

		List emplList = g4Reader.queryForPage(
				"EMPLOYEE.queryEmployeesForManage", dto);
		for (int i = 0; i < emplList.size(); i++) {
			Dto dto2 = (BaseDto) emplList.get(i);
			dto2.put("birthday", G4Utils.stringToDate(
					dto2.getAsString("birthday"), "yyyyMMdd", "yyyy-MM-dd"));
			dto2.put("hiredate", G4Utils.stringToDate(
					dto2.getAsString("hiredate"), "yyyyMMdd", "yyyy-MM-dd"));
		}
		Integer pageCount = (Integer) g4Reader.queryForObject(
				"EMPLOYEE.queryEmployeesForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(emplList, pageCount,
				G4Constants.FORMAT_Date);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward queryZbzw4Paging(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		List zbzwList = g4Reader.queryForPage("Zbzw.queryZbzwForManage", dto);
		Integer totalInteger = (Integer) g4Reader.queryForObject(
				"Zbzw.queryZbzwForManageForPageCount", dto);
		String jsonString = encodeList2PageJson(zbzwList, totalInteger, null);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward queryInfoByIDCard(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {

		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String idCard = request.getParameter("idcard");
		dto.put("sfzh", idCard);
		Dto outDto = new BaseDto();
		Integer IDCount = (Integer) g4Reader.queryForObject(
				"LXYBMSQB.checkIDCardUpdate", dto);
		if (IDCount > 0) {
			outDto.put("success", new Boolean(false));
			outDto.put("msg", "身份证号重复！");
		} else {
			if (G4Utils.isIdentity(idCard)) {
				outDto.put("birthday", G4Utils.Date2String(
						G4Utils.getBirthdayFromPersonIDCode(idCard),
						"yyyy-MM-dd"));
				outDto.put("sex", G4Utils.getGenderFromPersonIDCode(idCard));
				outDto.put("success", new Boolean(true));
				outDto.put("msg", "成功！");
			} else {
				outDto.put("success", new Boolean(false));
				outDto.put("msg", "无效的身份证号！");
			}
		}
		String jsonString = this.encodeObjectJson(outDto);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward updateEmplItem(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		inDto.put("birthday",
				G4Utils.Date2String(inDto.getAsDate("birthday"), "yyyyMMdd"));
		inDto.put("hiredate",
				G4Utils.Date2String(inDto.getAsDate("hiredate"), "yyyyMMdd"));
		if (!isDemoMode(response)) {
			employeeService.updateEmployeeItem(inDto);
			setOkTipMsg("用户数据修改成功", response);
		}
		return mapping.findForward(null);
	}

	public ActionForward deleteEmplItem(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		String strChecked = request.getParameter("strChecked");
		Dto inDto = new BaseDto();
		inDto.put("strChecked", strChecked);
		if (!isDemoMode(response)) {
			employeeService.deleteEmployeeItem(inDto);
			setOkTipMsg("用户数据删除成功", response);
		}
		return mapping.findForward(null);
	}

	public ActionForward updateEmplByHrItem(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String strChecked = request.getParameter("strChecked");
		Dto inDto = new BaseDto();
		inDto.put("strChecked", strChecked);
		if (!isDemoMode(response)) {
			employeeService.upateEmplDept(inDto);
			setOkTipMsg("用户数据同步成功", response);
		}
		return mapping.findForward(null);
	}
}
