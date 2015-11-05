package org.infotechdept.hr.kq.service.impl;

import java.util.List;

import org.g4studio.common.service.impl.BaseServiceImpl;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;
import org.g4studio.core.util.G4Utils;
import org.infotechdept.hr.kq.service.AdcOvertimeService;

import com.hr.xl.system.utils.IDHelper;

public class AdcOvertimeServiceImpl extends BaseServiceImpl implements AdcOvertimeService {

	public Dto saveAdcOvertimeItem(Dto pDto) {
		String overCode = IDHelper.getOverCode();
		List<Dto> aList = pDto.getDefaultAList();
		pDto.put("over_code", overCode);
		g4Dao.insert("AdcOvertime.saveAdcOvertimeItem", pDto);
		for (Dto dto : aList) {
			dto.put("over_code", overCode);
			g4Dao.insert("AdcOvertime.saveAdcOvertimeDetailItem", dto);
		}
		return null;
	}

	public Dto deleteAdcOvertimeItems(Dto pDto) {
		Dto dto = new BaseDto();
		String[] arrChecked = pDto.getAsString("strChecked").split(",");
		for (int i = 0; i < arrChecked.length; i++) {
			dto.put("over_code", arrChecked[i]);
			g4Dao.delete("AdcOvertime.deleteAdcOvertimeDetailItemsByOvercode", dto);
			g4Dao.delete("AdcOvertime.deleteAdcOvertimeItems", dto);
		}
		return null;
	}

	public Dto updateAdcOvertimeItem(Dto pDto) {
		Dto dto = new BaseDto();
		String overCode = pDto.getAsString("over_code");
		dto.put("over_code", pDto.getAsString("over_code"));
		g4Dao.delete("AdcOvertime.deleteAdcOvertimeDetailItemsByOvercode", dto);
		List<Dto> aList = pDto.getDefaultAList();
		for (Dto dto1 : aList) {
			dto1.put("over_code", overCode);
			g4Dao.insert("AdcOvertime.saveAdcOvertimeDetailItem", dto1);
		}
		g4Dao.update("AdcOvertime.updateAdcOvertimeItem", pDto);
		return null;
	}

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

		String overCode = IDHelper.getOverCode();
		pDto.put("over_code", overCode);
		g4Dao.insert("AdcOvertime.saveAdcOvertimeItem", pDto);
		for (Dto dto : aList) {
			dto.put("over_code", overCode);
			String name = dto.getAsString("name");
			if (G4Utils.isEmpty("name")) {
				continue;
			}
			String code = dto.getAsString("code");
			if (G4Utils.isEmpty(dto.getAsString("days_normal")) && G4Utils.isEmpty(dto.getAsString("hours_normal"))
					&& G4Utils.isEmpty(dto.getAsString("days_weekend")) && G4Utils.isEmpty(dto.getAsString("hours_weekend"))
					&& G4Utils.isEmpty(dto.getAsString("days_holiday")) && G4Utils.isEmpty(dto.getAsString("hours_holiday"))) {
				continue;
			}

			Dto d = new BaseDto();
			d.put("code", code);
			Integer empid = (Integer) g4Dao.queryForObject("EMPLOYEE.queryEmpidByCode", d);
			dto.put("empid", empid);
			g4Dao.insert("AdcOvertime.saveAdcOvertimeDetailItem", dto);
		}
		outDto.put("success", new Boolean(true));
		outDto.put("msg", "导入成功，单据号为[" + overCode + "].");
		return outDto;
	}

	public Dto updateAdcOvertimeRptstate(Dto pDto) {
		Dto dto = new BaseDto();
		String[] arrChecked = pDto.getAsString("strChecked").split(",");
		for (int i = 0; i < arrChecked.length; i++) {
			dto.put("over_code", arrChecked[i]);
			dto.put("rpt_state", "2");
			g4Dao.update("AdcOvertime.updateAdcOvertimeItem", dto);
		}
		return null;
	}
}
