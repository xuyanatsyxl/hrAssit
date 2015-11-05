package org.infotechdept.hr.kq.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.g4studio.common.service.impl.BaseServiceImpl;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;
import org.infotechdept.hr.kq.service.AdcShiftService;

import com.hr.xl.system.utils.IDHelper;

public class AdcShiftServiceImpl extends BaseServiceImpl implements AdcShiftService {

	public Dto saveAdcShiftItem(Dto pDto) {
		String shiftId = IDHelper.getShiftId();
		pDto.put("shift_id", shiftId);
		g4Dao.insert("AdcShift.saveAdcShiftItem", pDto);
		return null;
	}

	public Dto updateAdcShiftItem(Dto pDto) {
		g4Dao.update("AdcShift.updateAdcShiftItem", pDto);
		return null;
	}

	public Dto deleteAdcShiftItem(Dto pDto) {
		Dto dto = new BaseDto();
		List<String> unDelList = new ArrayList();
		String[] arrChecked = pDto.getAsString("strChecked").split(",");
		for (int i = 0; i < arrChecked.length; i++) {
			dto.put("shift_id", arrChecked[i]);
			// 先检查是否可以删除
			Integer temp = (Integer) g4Dao.queryForObject("AdcShift.checkIsInUsed", dto);
			if (temp.intValue() > 0) {
				unDelList.add(arrChecked[i]);
				continue;
			}
			g4Dao.delete("AdcShift.deleteAdcShiftDetailItemByShiftId", dto);
			g4Dao.delete("AdcShift.deleteAdcShiftItem", dto);
		}
		Dto outDto = new BaseDto();
		outDto.put("success", new Boolean(true));
		outDto.put("msg", "班次删除成功！");
		String msg = null;
		if (unDelList.size() > 0) {
			for (String s : unDelList) {
				msg += "," + s;
			}
			outDto.put("msg", "下列班次在使用中，不能删除！" + msg);
		}
		return outDto;
	}

	public Dto saveAdcShiftDetailItem(Dto pDto) {
		g4Dao.insert("AdcShift.saveAdcShiftDetailItem", pDto);
		return null;
	}

	public Dto updateAdcShiftDetailItem(Dto pDto) {
		g4Dao.update("AdcShift.updateAdcShiftDetailItem", pDto);
		return null;
	}

	public Dto deleteAdcShiftDetailItem(Dto pDto) {
		// TODO Auto-generated method stub
		return null;
	}

}
