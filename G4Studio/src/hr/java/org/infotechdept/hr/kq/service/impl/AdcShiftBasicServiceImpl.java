package org.infotechdept.hr.kq.service.impl;

import org.g4studio.common.service.impl.BaseServiceImpl;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;
import org.infotechdept.hr.kq.service.AdcShiftBasicService;

import com.hr.xl.system.utils.IDHelper;

public class AdcShiftBasicServiceImpl extends BaseServiceImpl implements AdcShiftBasicService {

	public Dto saveAdcShiftBasicItem(Dto pDto) {
		String shiftId = IDHelper.getShiftId();
		pDto.put("shift_id", shiftId);
		g4Dao.insert("AdcShiftBasic.saveAdcShiftBasicItem", pDto);
		return null;
	}

	public Dto updateAdcShiftBasicItem(Dto pDto) {
		g4Dao.update("AdcShiftBasic.updateAdcShiftBasicItem", pDto);
		return null;
	}

	public Dto deleteAdcShiftBasicItem(Dto pDto) {
		Dto dto = new BaseDto();
		String notDel = null;
		String[] arrChecked = pDto.getAsString("strChecked").split(",");
		for (int i = 0; i < arrChecked.length; i++) {
			dto.put("shift_id", arrChecked[i]);
			Integer temp = (Integer) g4Dao.queryForObject("AdcShiftBasic.checkAdcShiftBasicInUsed", dto);
			if (temp.intValue() > 0) {
				notDel += arrChecked[i] + ",";
				continue;
			}
			g4Dao.delete("AdcShiftBasic.deleteAdcShiftBasicItem", dto);
		}
		Dto outDto = new BaseDto();
		outDto.put("success", new Boolean(true));
		outDto.put("msg", "删除完毕，不能删除的班次如下：" + notDel);
		return outDto;
	}

}
