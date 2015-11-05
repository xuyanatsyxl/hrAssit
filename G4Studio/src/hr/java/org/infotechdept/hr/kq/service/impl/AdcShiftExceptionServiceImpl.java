package org.infotechdept.hr.kq.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.g4studio.common.service.impl.BaseServiceImpl;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;
import org.infotechdept.hr.kq.service.AdcShiftExceptionService;

public class AdcShiftExceptionServiceImpl extends BaseServiceImpl implements AdcShiftExceptionService {

	public Dto updateAdcShiftExceptionItem(Dto pDto) {
		String adc_id = pDto.getAsString("adc_id");
		List exception_ids = new ArrayList<String>();
		pDto.put("proc_state", new String("3"));
		String[] arrChecked = pDto.getAsString("strChecked").split(",");
		for (int i = 0; i < arrChecked.length; i++) {
			pDto.put("id", arrChecked[i]);
			exception_ids.add(arrChecked[i]);
			g4Dao.update("AdcShiftException.updateAdcShiftExceptionItem", pDto);
		}

		// 是否更新排班表
		Dto dto = new BaseDto();
		dto.put("adc_id", adc_id);
		Dto adcAttendTypeDto = (Dto) g4Dao.queryForObject("AdcAttendType.queryAdcAttendTypeItemForManage", dto);
		if (adcAttendTypeDto.getAsString("type_type").equalsIgnoreCase("1")) {
			// 查找排班ID
			dto.clear();
			dto.put("exception_ids", exception_ids);
			List<Dto> oldList = g4Dao.queryForList("AdcShiftException.queryAdcShiftExceptionItemForManage", dto);

			dto.clear();
			dto.put("sch_ids", oldList);
			List<Dto> schList = g4Dao.queryForList("AdcShiftScheduling.queryAdcShiftSchedulingItemForManage", dto);
			dto.clear();
			for (Dto d : schList) {
				dto.put("id", d.getAsInteger("id"));
				dto.put("adc_id", adc_id);
				g4Dao.update("AdcShiftScheduling.updateAdcShiftSchedulingItem", dto);
			}
		}
		return null;
	}

	public Dto saveAdcShiftExceptionItem(Dto pDto) {
		// TODO Auto-generated method stub
		return null;
	}

}
