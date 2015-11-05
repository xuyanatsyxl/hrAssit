package org.infotechdept.hr.kq.service.impl;

import org.g4studio.common.service.impl.BaseServiceImpl;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;
import org.infotechdept.hr.kq.service.AdcShiftRecordService;

public class AdcShiftRecordServiceImpl extends BaseServiceImpl implements AdcShiftRecordService {

	public Dto saveAdcShiftRecordItem(Dto pDto) {
		g4Dao.insert("AdcShiftRecord.saveAdcShiftRecordItem", pDto);
		return null;
	}

	public Dto deleteAdcShiftRecordItem(Dto pDto) {
		Dto dto = new BaseDto();
		String[] arrChecked = pDto.getAsString("strChecked").split(",");
		for (int i = 0; i < arrChecked.length; i++) {
			dto.put("rec_id", arrChecked[i]);
			g4Dao.delete("AdcShiftRecord.deleteAdcShiftRecordItem", dto);
		}
		Dto outDto = new BaseDto();
		outDto.put("success", new Boolean(true));
		outDto.put("msg", "删除完毕！");
		return outDto;
	}

	public Dto updateAdcShiftRecordItem(Dto pDto) {
		g4Dao.update("AdcShiftReocrd.updateAdcShiftRecordItem", pDto);
		return null;
	}

}
