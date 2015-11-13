package org.infotechdept.hr.kq.service.impl;

import java.util.List;

import org.g4studio.common.service.impl.BaseServiceImpl;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;
import org.g4studio.core.util.G4Utils;
import org.infotechdept.hr.kq.service.AdcShiftDutyService;

import com.hr.xl.system.utils.IDHelper;

public class AdcShiftDutyServiceImpl extends BaseServiceImpl implements AdcShiftDutyService {

	/**
	 * 新增值班表
	 */
	public Dto saveAdcShiftDutyItem(Dto pDto) {
		String dutyId = IDHelper.getDutyId();
		List<Dto> aList = pDto.getDefaultAList();
		pDto.put("dutyid", dutyId);
		g4Dao.insert("AdcShiftDuty.saveAdcShiftDutyItem", pDto);
		for (Dto dto : aList) {
			dto.put("dutyid", dutyId);
			g4Dao.insert("AdcShiftDuty.saveAdcShiftDutyDetailItem", dto);
		}
		return null;
	}

	/**
	 * 更新值班表
	 */
	public Dto updateAdcShiftDutyItem(Dto pDto) {
		Dto dto = new BaseDto();
		String dutyId = pDto.getAsString("dutyid");
		dto.put("dutyid", pDto.getAsString("dutyid"));
		g4Dao.delete("AdcShiftDuty.deleteAdcShiftDutyDetailItemByDutyId", dto);
		List<Dto> aList = pDto.getDefaultAList();
		for (Dto dto1 : aList) {
			dto1.put("dutyid", dutyId);
			g4Dao.insert("AdcShiftDuty.saveAdcShiftDutyDetailItem", dto1);
		}
		g4Dao.update("AdcShiftDuty.updateAdcShiftDutyItem", pDto);
		return null;
	}

	/**
	 * 删除值班表
	 */
	public Dto deleteAdcShiftDutyItem(Dto pDto) {
		Dto dto = new BaseDto();
		String[] arrChecked = pDto.getAsString("strChecked").split(",");
		for (int i = 0; i < arrChecked.length; i++) {
			dto.put("dutyid", arrChecked[i]);
			g4Dao.delete("AdcShiftDuty.deleteAdcShiftDutyDetailItemByDutyId", dto);
			g4Dao.delete("AdcShiftDuty.deleteAdcShiftDutyItem", dto);
		}
		return null;
	}

	@Override
	public Dto saveAdcShiftDutyDetailItem(Dto pDto) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Dto updateAdcShiftDutyDetailItem(Dto pDto) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Dto deleteAdcShiftDutyDetailItem(Dto pDto) {
		// TODO Auto-generated method stub
		return null;
	}
	
	/**
	 * 导入值班表EXCEL
	 */
	public Dto importFromExcel(Dto pDto) {
		Dto outDto = new BaseDto();
		List<Dto> aList = pDto.getDefaultAList();
		String deptid = pDto.getAsString("deptid");
		if (G4Utils.isEmpty(deptid)) {
			outDto.put("success", new Boolean(false));
			outDto.put("msg", "缺少必要的参数：deptid");
			return outDto;
		}
		String yearmonth = pDto.getAsString("yearmonth");
		if (G4Utils.isEmpty(yearmonth)) {
			outDto.put("success", new Boolean(false));
			outDto.put("msg", "缺少必要的参数：yearmonth");
			return outDto;
		}

		String dutyId = IDHelper.getDutyId();
		pDto.put("dutyid", dutyId);
		g4Dao.insert("AdcShiftDuty.saveAdcShiftDutyItem", pDto);
		
		for (Dto dto : aList) {
			String name = dto.getAsString("name");
			if (G4Utils.isEmpty("name")) {
				continue;
			}
			String code = dto.getAsString("code");
			if (G4Utils.isEmpty(dto.getAsString("code"))) {
				continue;
			}
			//code如果长度不足标准的8位，就前补零
			if (code.length() < 8){
				code = "00000000" + code;
				code = code.substring(code.length() - 8, code.length());
			}

			Dto d = new BaseDto();
			d.put("code", code);
			Integer empid = (Integer) g4Dao.queryForObject("EMPLOYEE.queryEmpidByCode", d);
			d.clear();
			d.put("empid", empid);
			d.put("deptid", deptid);
			List<Dto> deptempls = g4Dao.queryForList("Deptempl.queryDeptemplItemForManage", d);
			if (deptempls.size() == 0){
				outDto.put("success", new Boolean(false));
				outDto.put("msg", "姓名[" + name + "]不在所选择的部门内，无法导入!");
				return outDto;
			}
			
			//校验SHIFT_ID
			String shiftId = dto.getAsString("shift_id");
			if (G4Utils.isEmpty(shiftId)){
				continue;
			}
			if (shiftId.length() < 8){
				shiftId = "00000000" + shiftId;
				shiftId = shiftId.substring(shiftId.length() - 8, shiftId.length());
			}			
			d.clear();
			d.put("shift_id", shiftId);
			List<Dto> shifts = g4Dao.queryForList("AdcShiftBasic.queryAdcShiftBasicItemForManage", d);
			if (shifts.size() == 0){
				outDto.put("success", new Boolean(false));
				outDto.put("msg", "不存在的班次号[" + shiftId + "]，无法导入!");
				return outDto;				
			}
			
			//检查日期格式
			String dutyDate = dto.getAsString("dutydate");
			if(dutyDate.trim().length() != 8){
				outDto.put("success", new Boolean(false));
				outDto.put("msg", "日期格式错误，无法导入！必须为四位年+2位月+2位日期，如：20020828，当前为[" + dutyDate + "]");
				return outDto;				
			}
			
			dto.put("dutydate", G4Utils.stringToDate(dutyDate, "yyyyMMdd", "yyyy-MM-dd"));
			dto.put("empid", empid);
			dto.put("deptid", deptempls.get(0).getAsString("deptid"));
			dto.put("jobname", deptempls.get(0).getAsString("jobname"));
			dto.put("shift_id", shiftId);
			dto.put("dutyid", dutyId);
			
			g4Dao.insert("AdcShiftDuty.saveAdcShiftDutyDetailItem", dto);
		}
		outDto.put("success", new Boolean(true));
		outDto.put("msg", "导入成功，单据号为[" + dutyId + "].");
		return outDto;
	}
	
	/**
	 * 值班表审核
	 * @param pDto
	 * @return
	 */
	public Dto updateAdcShiftDutyRptstate(Dto pDto){
		String rsltMsg = null;
		Dto dto = new BaseDto();
		Dto outDto = new BaseDto();
		String[] arrChecked = pDto.getAsString("strChecked").split(",");
		for (int i = 0; i < arrChecked.length; i++) {
			String dutyId = arrChecked[i];
			Dto rslt = saveAdcShiftDutyCheckItem(dutyId);
			if (rslt.getAsBoolean("success")){
				dto.clear();
				dto.put("dutyid", arrChecked[i]);
				dto.put("rpt_state", "2");
				g4Dao.update("AdcShiftDuty.updateAdcShiftDutyItem", dto);
			}else{
				rsltMsg += "单据[" + dutyId + "]审核失败！原因：[" + rslt.getAsString("message") + "]\r\n"; 
			}
		}
		outDto.put("success", new Boolean(true));
		outDto.put("message", rsltMsg);
		return outDto;
	}
	
	/**
	 * 单张值班表审核
	 * 先查找排班记录，如果有，就直接应用
	 * @param pDto
	 * @return
	 */
	private Dto saveAdcShiftDutyCheckItem(String dutyId){
		Dto outDto = new BaseDto();
		Dto dto = new BaseDto();
		dto.put("dutyid", dutyId);
		List<Dto> items = g4Dao.queryForList("AdcShiftDuty.queryAdcShiftDutyDetailItemForManage", dto);
		if (items.size() == 0){
			outDto.put("success", new Boolean(false));
			outDto.put("message", "无效的值班表号");
			return outDto;
		}
		
		String shiftId = items.get(0).getAsString("shift_id");
		dto.clear();
		dto.put("shift_id", shiftId);
		List<Dto> it = g4Dao.queryForList("AdcShiftBasic.queryAdcShiftBasicItemForManage", dto);
		String adcId = it.get(0).getAsString("adc_id");
		dto.clear();
		dto.put("adc_date", items.get(0).getAsDate("dutydate"));
		dto.put("deptid", items.get(0).getAsString("deptid"));
		dto.put("empid", items.get(0).getAsInteger("empid"));
		dto.put("adc_id", adcId);
		dto.put("addition_info", dutyId);
		dto.put("aff_days", "1");
		dto.put("aff_hours", "0");
		dto.put("state", "1");
		dto.put("requestid", null);
		dto.put("source_type", "3"); //新定义的来源，值班表
		dto.put("operator", "10000001");
		dto.put("operate_time", G4Utils.getCurDate());
		dto.put("remark", null);

		g4Dao.insert("AdcShiftLeave.saveAdcShiftLeaveItem", dto);
		outDto.put("success", new Boolean(true));
		
		return outDto;
	}

}
