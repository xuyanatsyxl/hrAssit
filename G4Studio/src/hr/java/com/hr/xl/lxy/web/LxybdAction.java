package com.hr.xl.lxy.web;

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

import com.hr.xl.lxy.service.LxybdService;

public class LxybdAction extends BaseAction {

	private LxybdService lxybdService = (LxybdService) super.getService("lxybdService");
	private OrganizationService organizationService = (OrganizationService) super.getService("organizationService");

	public ActionForward lxysgInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		super.removeSessionAttribute(request, "deptid");
		Dto inDto = new BaseDto();
		String deptid = super.getSessionContainer(request).getUserInfo().getDeptid();
		inDto.put("deptid", deptid);
		Dto outDto = organizationService.queryDeptinfoByDeptid(inDto);
		request.setAttribute("rootDeptid", outDto.getAsString("deptid"));
		request.setAttribute("rootDeptname", outDto.getAsString("deptname"));
		UserInfoVo userInfoVo = getSessionContainer(request).getUserInfo();
		request.setAttribute("login_account", userInfoVo.getAccount());
		return mapping.findForward("lxysgView");
	}

	public ActionForward lxylzcprsInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		super.removeSessionAttribute(request, "deptid");
		Dto inDto = new BaseDto();
		String deptid = super.getSessionContainer(request).getUserInfo().getDeptid();
		inDto.put("deptid", deptid);
		Dto outDto = organizationService.queryDeptinfoByDeptid(inDto);
		request.setAttribute("rootDeptid", outDto.getAsString("deptid"));
		request.setAttribute("rootDeptname", outDto.getAsString("deptname"));
		UserInfoVo userInfoVo = getSessionContainer(request).getUserInfo();
		request.setAttribute("login_account", userInfoVo.getAccount());
		return mapping.findForward("lxylzcprsView");
	}

	public ActionForward bmlxyxxwhInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		super.removeSessionAttribute(request, "deptid");
		Dto inDto = new BaseDto();
		String deptid = super.getSessionContainer(request).getUserInfo().getDeptid();
		inDto.put("deptid", deptid);
		Dto outDto = organizationService.queryDeptinfoByDeptid(inDto);
		request.setAttribute("rootDeptid", outDto.getAsString("deptid"));
		request.setAttribute("rootDeptname", outDto.getAsString("deptname"));
		UserInfoVo userInfoVo = getSessionContainer(request).getUserInfo();
		request.setAttribute("login_account", userInfoVo.getAccount());
		return mapping.findForward("bmlxyxxwhView");
	}

	public ActionForward lxyddInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		super.removeSessionAttribute(request, "deptid");
		Dto inDto = new BaseDto();
		String deptid = super.getSessionContainer(request).getUserInfo().getDeptid();
		inDto.put("deptid", deptid);
		Dto outDto = organizationService.queryDeptinfoByDeptid(inDto);
		request.setAttribute("rootDeptid", outDto.getAsString("deptid"));
		request.setAttribute("rootDeptname", outDto.getAsString("deptname"));
		UserInfoVo userInfoVo = getSessionContainer(request).getUserInfo();
		request.setAttribute("login_account", userInfoVo.getAccount());
		return mapping.findForward("lxyddView");
	}

	public ActionForward lxyxjInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		super.removeSessionAttribute(request, "deptid");
		Dto inDto = new BaseDto();
		String deptid = super.getSessionContainer(request).getUserInfo().getDeptid();
		inDto.put("deptid", deptid);
		Dto outDto = organizationService.queryDeptinfoByDeptid(inDto);
		request.setAttribute("rootDeptid", outDto.getAsString("deptid"));
		request.setAttribute("rootDeptname", outDto.getAsString("deptname"));
		UserInfoVo userInfoVo = getSessionContainer(request).getUserInfo();
		request.setAttribute("login_account", userInfoVo.getAccount());
		return mapping.findForward("lxyxjView");
	}

	public ActionForward lxyhmdInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		super.removeSessionAttribute(request, "deptid");
		Dto inDto = new BaseDto();
		String deptid = super.getSessionContainer(request).getUserInfo().getDeptid();
		inDto.put("deptid", deptid);
		Dto outDto = organizationService.queryDeptinfoByDeptid(inDto);
		request.setAttribute("rootDeptid", outDto.getAsString("deptid"));
		request.setAttribute("rootDeptname", outDto.getAsString("deptname"));
		UserInfoVo userInfoVo = getSessionContainer(request).getUserInfo();
		request.setAttribute("login_account", userInfoVo.getAccount());
		return mapping.findForward("lxyhmdView");
	}

	public ActionForward lxylzInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		super.removeSessionAttribute(request, "deptid");
		Dto inDto = new BaseDto();
		String deptid = super.getSessionContainer(request).getUserInfo().getDeptid();
		inDto.put("deptid", deptid);
		Dto outDto = organizationService.queryDeptinfoByDeptid(inDto);
		request.setAttribute("rootDeptid", outDto.getAsString("deptid"));
		request.setAttribute("rootDeptname", outDto.getAsString("deptname"));
		UserInfoVo userInfoVo = getSessionContainer(request).getUserInfo();
		request.setAttribute("login_account", userInfoVo.getAccount());
		return mapping.findForward("lxylzView");
	}

	public ActionForward lxyjkzInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		super.removeSessionAttribute(request, "deptid");
		Dto inDto = new BaseDto();
		String deptid = super.getSessionContainer(request).getUserInfo().getDeptid();
		inDto.put("deptid", deptid);
		Dto outDto = organizationService.queryDeptinfoByDeptid(inDto);
		request.setAttribute("rootDeptid", outDto.getAsString("deptid"));
		request.setAttribute("rootDeptname", outDto.getAsString("deptname"));
		UserInfoVo userInfoVo = getSessionContainer(request).getUserInfo();
		request.setAttribute("login_account", userInfoVo.getAccount());
		return mapping.findForward("lxyjkzView");
	}

	public ActionForward queryLxysgForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String userid = super.getSessionContainer(request).getUserInfo().getUserid();
		if (!G4Utils.isEmpty(dto.getAsString("jdr"))) {
			int jdr = Integer.parseInt(dto.getAsString("jdr").trim());

			if (jdr == 1) {
				System.out.println(jdr + "=jdr");
				dto.put("jdr", userid);
				dto.put("njdr", "");
			} else if (jdr == 2) {
				System.out.println(jdr + "=jdr");
				dto.put("jdr", "");
				dto.put("njdr", userid);
			}
		}
		if (!G4Utils.isEmpty(dto.getAsString("ksrq"))) {
			dto.put("ksrq", G4Utils.Date2String(dto.getAsDate("ksrq"), "yyyyMMdd"));
		}

		if (!G4Utils.isEmpty(dto.getAsString("jsrq"))) {
			dto.put("jsrq", G4Utils.Date2String(dto.getAsDate("jsrq"), "yyyyMMdd"));
		}
		/*
		 * SELECT a.RYID, a.RYBH, a.XM, a.XB, a.CSRQ, a.SFZH, a.LXSJ, a.JDRQ,
		 * (select username from eauser where userid=a.JDR) AS JDR, a.DQZT, a.BZ
		 */
		List userList = g4Reader.queryForPage("LXYBD.queryLxysgForManage", dto);
		for (int i = 0; i < userList.size(); i++) {
			Dto dto2 = (BaseDto) userList.get(i);
			dto2.put("csrq", G4Utils.stringToDate(dto2.getAsString("csrq"), "yyyyMMdd", "yyyy-MM-dd"));
			dto2.put("jdrq", G4Utils.stringToDate(dto2.getAsString("jdrq"), "yyyyMMdd", "yyyy-MM-dd"));
		}

		Integer pageCount = (Integer) g4Reader.queryForObject("LXYBD.queryLxysgForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(userList, pageCount, G4Constants.FORMAT_Date);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	/**
	 * 联销员重聘入司
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward queryLxylzcprsForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);

		List userList = g4Reader.queryForPage("LXYBD.queryLxylzcprsForManage", dto);

		for (int i = 0; i < userList.size(); i++) {
			Dto dto2 = (BaseDto) userList.get(i);
			dto2.put("csrq", G4Utils.stringToDate(dto2.getAsString("csrq"), "yyyyMMdd", "yyyy-MM-dd"));
			dto2.put("jdrq", G4Utils.stringToDate(dto2.getAsString("jdrq"), "yyyyMMdd", "yyyy-MM-dd"));
		}
		Integer pageCount = (Integer) g4Reader.queryForObject("LXYBD.queryLxylzcprsForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(userList, pageCount, G4Constants.FORMAT_Date);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	// 保存联销员上岗数据
	public ActionForward saveLxysgItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String userid = super.getSessionContainer(request).getUserInfo().getUserid();
		dto.put("czy", userid);
		dto.put("ydrq", G4Utils.getCurrentTimestamp());
		dto.put("sgrq", dto.getAsTimestamp("sgrq"));
		dto.put("yxq", dto.getAsTimestamp("yxq"));
		lxybdService.saveLxysgItem(dto);
		setOkTipMsg("联销员上岗办理成功!", response);
		return mapping.findForward(null);
	}

	public ActionForward lxybdcxInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		super.removeSessionAttribute(request, "deptid");
		Dto inDto = new BaseDto();
		String deptid = super.getSessionContainer(request).getUserInfo().getDeptid();
		inDto.put("deptid", deptid);
		Dto outDto = organizationService.queryDeptinfoByDeptid(inDto);
		request.setAttribute("rootDeptid", outDto.getAsString("deptid"));
		request.setAttribute("rootDeptname", outDto.getAsString("deptname"));
		UserInfoVo userInfoVo = getSessionContainer(request).getUserInfo();
		request.setAttribute("login_account", userInfoVo.getAccount());
		return mapping.findForward("lxybdcxView");
	}

	public ActionForward saveLxybdcxItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		Dto outDto = lxybdService.saveLxybdcxItem(dto);
		String jsonString = JsonHelper.encodeObject2Json(outDto);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward queryLxylzForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String deptid = request.getParameter("deptid");
		if (G4Utils.isNotEmpty(deptid)) {
			setSessionAttribute(request, "deptid", deptid);
		}
		if (!G4Utils.isEmpty(request.getParameter("firstload"))) {
			dto.put("deptid", super.getSessionContainer(request).getUserInfo().getDeptid());
		} else {
			dto.put("deptid", super.getSessionAttribute(request, "deptid"));
		}
		List lxylzList = g4Reader.queryForPage("LXYBD.queryLxylzForManage", dto);
		/*
		 * SELECT b.DEPTID, (SELECT DEPTNAME from eadept where DEPTID=b.DEPTID)
		 * as deptname, a.RYID, a.RYBH, a.XM, a.XB, b.YGXJ, b.GHDW, b.PP,
		 * b.YDRQ,a.DQZT,a.SFZH,b.GW
		 */
		for (int i = 0; i < lxylzList.size(); i++) {
			Dto dto2 = (BaseDto) lxylzList.get(i);
			dto2.put("ydrq", G4Utils.stringToDate(dto2.getAsString("ydrq"), "yyyyMMdd", "yyyy-MM-dd"));
		}
		Integer pageCount = (Integer) g4Reader.queryForObject("LXYBD.queryLxylzForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(lxylzList, pageCount, G4Constants.FORMAT_Date);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward queryLxyddForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aform = (BaseActionForm) form;
		Dto dto = aform.getParamAsDto(request);
		String deptid = request.getParameter("deptid");
		if (G4Utils.isNotEmpty(deptid)) {
			setSessionAttribute(request, "deptid", deptid);
		}
		if (!G4Utils.isEmpty(request.getParameter("firstload"))) {
			dto.put("deptid", super.getSessionContainer(request).getUserInfo().getDeptid());
		} else {
			dto.put("deptid", super.getSessionAttribute(request, "deptid"));
		}
		List lxyddlist = g4Reader.queryForPage("LXYBD.queryLxyddForManage", dto);
		for (int i = 0; i < lxyddlist.size(); i++) {
			Dto dto2 = (BaseDto) lxyddlist.get(i);
			dto2.put("ydrq", G4Utils.stringToDate(dto2.getAsString("ydrq"), "yyyyMMdd", "yyyy-MM-dd"));
		}
		Integer pageCount = (Integer) g4Reader.queryForObject("LXYBD.queryLxyddForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(lxyddlist, pageCount, G4Constants.FORMAT_Date);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward updatelxydd(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm aform = (BaseActionForm) form;
		Dto dto = aform.getParamAsDto(request);
		lxybdService.updateLxydd(dto);
		setOkTipMsg("数据更新成功！", response);
		return null;
	}

	/**
	 * 联销员离职
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward saveLxylzItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		List items = aForm.getGridDirtyData(request);
		dto.setDefaultAList(items);
		String userid = super.getSessionContainer(request).getUserInfo().getUserid();
		dto.put("czy", userid);
		dto.put("ydrq", G4Utils.getCurrentTimestamp());
		dto.put("lzrq", dto.getAsTimestamp("lzrq"));
		lxybdService.saveLxylzItem(dto);
		setOkTipMsg("联销员离职办理成功!", response);

		return mapping.findForward(null);
	}

	public ActionForward queryLxyhmdForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String userid = super.getSessionContainer(request).getUserInfo().getUserid();
		dto.put("czy", userid);
		dto.put("czsj", G4Utils.getCurrentTimestamp());
		if (G4Utils.isEmpty(dto.getAsString("deptid"))) {
			dto.put("deptid", super.getSessionContainer(request).getUserInfo().getDeptid());
		}
		List lxyhmdList = g4Reader.queryForPage("LXYBD.queryLxyhmdForManage", dto);
		/*
		 * SELECT b.DEPTID, (SELECT DEPTNAME from eadept where DEPTID=b.DEPTID)
		 * as deptname, a.RYID, a.RYBH, a.XM, a.XB, b.YGXJ, a.SFZH, b.GHDW,
		 * b.PP, b.YDRQ,b.YGXJ
		 */
		for (int i = 0; i < lxyhmdList.size(); i++) {
			Dto dto2 = (BaseDto) lxyhmdList.get(i);
			dto2.put("ydrq", G4Utils.stringToDate(dto2.getAsString("ydrq"), "yyyyMMdd", "yyyy-MM-dd"));
		}
		Integer pageCount = (Integer) g4Reader.queryForObject("LXYBD.queryLxyhmdForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(lxyhmdList, pageCount, G4Constants.FORMAT_Date);
		write(jsonString, response);
		return mapping.findForward(null);

	}

	/*
	 * public ActionForward UpdateLxyhmd(ActionMapping mapping, ActionForm form,
	 * HttpServletRequest request, HttpServletResponse response) throws
	 * Exception { BaseActionForm aForm = (BaseActionForm) form; Dto dto =
	 * aForm.getParamAsDto(request); String userid =
	 * super.getSessionContainer(request).getUserInfo() .getUserid();
	 * dto.put("czy", userid); // dto.put("czsj", System.currentTimeMillis());
	 * Dto pdto = lxybdService.saveLxyHmdItem(dto); setOkTipMsg("加入黑名单成功",
	 * response); return mapping.findForward(null);
	 * 
	 * }
	 */

	public ActionForward querybmLxyxxwhForManager(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String deptid = request.getParameter("deptid");
		if (G4Utils.isNotEmpty(deptid)) {
			setSessionAttribute(request, "deptid", deptid);
		}
		if (!G4Utils.isEmpty(request.getParameter("firstload"))) {
			dto.put("deptid", super.getSessionContainer(request).getUserInfo().getDeptid());
		} else {
			dto.put("deptid", super.getSessionAttribute(request, "deptid"));
		}
		List lxylzList = g4Reader.queryForPage("LXYBD.querybmLxyxxwhForManage", dto);

		/*
		 * SELECT A.RYID, A.RYBH, A.XM, A.FULLNAME, A.XB, A.CSRQ, A.SG, A.MZ,
		 * A.YWBS, A.TZ, A.CSD, A.ZJXY, A.HKSZD, A.HKXZ, A.SFZH, A.ZZMM, A.HYZK,
		 * A.ZGXL, A.XLXZ, A.JZFS,A.LXSJ, A.LXZD, A.JZMJ, A.XZJ, A.LT, A.JJLXR,
		 * A.JJLXRZD,A.JDRQ, A.JJLXRSJ, A.BZ, A.JDRQ, A.DQZT, A.JDR, (SELECT
		 * USERNAME FROM EAUSER WHERE USERID=A.JDR) JDRM,b.ghdw,b.pp, (SELECT
		 * DEPTNAME from eadept where DEPTID=b.DEPTID) as deptname,b.DEPTID
		 * ,b.GW
		 */
		for (int i = 0; i < lxylzList.size(); i++) {
			Dto dto2 = (BaseDto) lxylzList.get(i);
			dto2.put("csrq", G4Utils.stringToDate(dto2.getAsString("csrq"), "yyyyMMdd", "yyyy-MM-dd"));
			dto2.put("jdrq", G4Utils.stringToDate(dto2.getAsString("jdrq"), "yyyyMMdd", "yyyy-MM-dd"));
			dto2.put("ydrq", G4Utils.stringToDate(dto2.getAsString("ydrq"), "yyyyMMdd", "yyyy-MM-dd"));

		}
		Integer pageCount = (Integer) g4Reader.queryForObject("LXYBD.querybmLxyxxwhForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(lxylzList, pageCount, G4Constants.FORMAT_Date);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward queryLxyjkzForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String deptid = request.getParameter("deptid");
		if (G4Utils.isNotEmpty(deptid)) {
			setSessionAttribute(request, "deptid", deptid);
		}
		if (!G4Utils.isEmpty(request.getParameter("firstload"))) {
			dto.put("deptid", super.getSessionContainer(request).getUserInfo().getDeptid());
		} else {
			dto.put("deptid", super.getSessionAttribute(request, "deptid"));
		}

		if (!G4Utils.isEmpty(dto.getAsString("jkzrqstart"))) {
			dto.put("jkzrqstart", G4Utils.Date2String(dto.getAsDate("jkzrqstart"), "yyyyMMdd"));

		}
		if (!G4Utils.isEmpty(dto.getAsString("jkzrqend"))) {
			dto.put("jkzrqend", G4Utils.Date2String(dto.getAsDate("jkzrqend"), "yyyyMMdd"));

		}

		List lxylzList = g4Reader.queryForPage("LXYBD.queryLxyjkzForManage", dto);
		/*
		 * SELECT b.DEPTID, (SELECT DEPTNAME from eadept where DEPTID=b.DEPTID)
		 * as deptname, a.RYID, a.RYBH, a.XM, a.XB, b.YGXJ, b.GHDW, b.PP,
		 * b.YDRQ, a.SFZH,b.HQXJRQ,B.XJJSRQ, b.JKZRQ
		 */
		for (int i = 0; i < lxylzList.size(); i++) {
			Dto dto2 = (BaseDto) lxylzList.get(i);
			dto2.put("ydrq", G4Utils.stringToDate(dto2.getAsString("ydrq"), "yyyyMMdd", "yyyy-MM-dd"));
			dto2.put("hqxjrq", G4Utils.stringToDate(dto2.getAsString("hqxjrq"), "yyyyMMdd", "yyyy-MM-dd"));
			dto2.put("xjjsrq", G4Utils.stringToDate(dto2.getAsString("xjjsrq"), "yyyyMMdd", "yyyy-MM-dd"));
			dto2.put("jkzrq", G4Utils.stringToDate(dto2.getAsString("jkzrq"), "yyyyMMdd", "yyyy-MM-dd"));
		}
		Integer pageCount = (Integer) g4Reader.queryForObject("LXYBD.queryLxyjkzForManageForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(lxylzList, pageCount, G4Constants.FORMAT_Date);
		write(jsonString, response);
		return mapping.findForward(null);
	}

	public ActionForward updatelxyjkz(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String userid = super.getSessionContainer(request).getUserInfo().getUserid();
		dto.put("czy", userid);
		// dto.put("czsj", System.currentTimeMillis());
		Dto pdto = lxybdService.saveLxyjkzItem(dto);
		setOkTipMsg("修改成功", response);
		return mapping.findForward(null);

	}

	public ActionForward queryBmlxyItemForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		String deptid = request.getParameter("deptid");
		if (G4Utils.isNotEmpty(deptid)) {
			setSessionAttribute(request, "deptid", deptid);
		}
		if (!G4Utils.isEmpty(request.getParameter("firstload"))) {
			dto.put("deptid", super.getSessionContainer(request).getUserInfo().getDeptid());
		} else {
			dto.put("deptid", super.getSessionAttribute(request, "deptid"));
		}

		List lxylzList = g4Reader.queryForList("BMLXY.queryBmlxyItemForManage", dto);
		for (int i = 0; i < lxylzList.size(); i++) {
			Dto dto2 = (BaseDto) lxylzList.get(i);
			dto2.put("ydrq", G4Utils.stringToDate(dto2.getAsString("ydrq"), "yyyyMMdd", "yyyy-MM-dd"));
			dto2.put("hqxjrq", G4Utils.stringToDate(dto2.getAsString("hqxjrq"), "yyyyMMdd", "yyyy-MM-dd"));
			dto2.put("xjjsrq", G4Utils.stringToDate(dto2.getAsString("xjjsrq"), "yyyyMMdd", "yyyy-MM-dd"));
			dto2.put("jkzrq", G4Utils.stringToDate(dto2.getAsString("jkzrq"), "yyyyMMdd", "yyyy-MM-dd"));
		}
		if (lxylzList.size() == 1) {
			String jsonString = JsonHelper.encodeDto2FormLoadJson((BaseDto) lxylzList.get(0), "yyyy-MM-dd");
			write(jsonString, response);
		} else {
			setErrTipMsg("没有记录!", response);
		}
		return mapping.findForward(null);
	}

	public ActionForward updateBmlxyItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		BaseActionForm aForm = (BaseActionForm) form;
		Dto dto = aForm.getParamAsDto(request);
		dto.put("ydrq", G4Utils.Date2String(dto.getAsDate("ydrq"), "yyyyMMdd"));
		Dto pdto = lxybdService.updateBmlxyItem(dto);
		setOkTipMsg("修改成功", response);
		return mapping.findForward(null);

	}
}
