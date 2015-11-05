package org.infotechdept.hr.kq.service.impl;

import java.util.List;

import org.g4studio.common.service.impl.BaseServiceImpl;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;
import org.infotechdept.hr.kq.service.AdcShiftPatternService;

import com.hr.xl.system.utils.IDHelper;

public class AdcShiftPatternServiceImpl extends BaseServiceImpl implements AdcShiftPatternService {

	public Dto saveAdcShiftPatternItem(Dto pDto) {
		String pattern_id = IDHelper.getShiftPatternId();
		pDto.put("pattern_id", pattern_id);
		g4Dao.insert("AdcShiftPattern.saveAdcShiftPatternItem", pDto);
		List lists = pDto.getDefaultAList();
		for (int i = 0; i < lists.size(); i++) {
			BaseDto dto = (BaseDto) lists.get(i);
			dto.put("pattern_id", pattern_id);
			saveAdcShiftPatternDetailItem(dto);
		}

		return null;
	}

	public Dto updateAdcShiftPatternItem(Dto pDto) {
		g4Dao.update("AdcShiftPattern.updateAdcShiftPatternItem", pDto);
		g4Dao.delete("AdcShiftPattern.deleteAdcShiftPatternDetailByPatternId", pDto);
		List lists = pDto.getDefaultAList();
		for (int i = 0; i < lists.size(); i++) {
			BaseDto dto = (BaseDto) lists.get(i);
			saveAdcShiftPatternDetailItem(dto);
		}
		return null;
	}

	public Dto deleteAdcShiftPatternItem(Dto pDto) {
		Dto dto = new BaseDto();
		String notDel = null;
		String[] arrChecked = pDto.getAsString("strChecked").split(",");
		for (int i = 0; i < arrChecked.length; i++) {
			dto.put("pattern_id", arrChecked[i]);
			/*
			 * Integer temp = (Integer)
			 * g4Dao.queryForObject("AdcShiftPattern.checkAdcShiftPatternInUsed"
			 * , dto); if (temp.intValue() > 0) { notDel += arrChecked[i] + ",";
			 * continue; }
			 */
			g4Dao.delete("AdcShiftPattern.deleteAdcShiftPatternDetailByPatternId", dto);
			g4Dao.delete("AdcShiftPattern.deleteAdcShiftPatternItem", dto);
		}
		Dto outDto = new BaseDto();
		outDto.put("success", new Boolean(true));
		outDto.put("msg", "删除完毕，不能删除的班次如下：" + notDel);
		return outDto;
	}

	public Dto saveAdcShiftPatternDetailItem(Dto pDto) {
		g4Dao.insert("AdcShiftPattern.saveAdcShiftPatternDetailItem", pDto);
		return null;
	}

	public Dto updateAdcShiftPatternDetailItem(Dto pDto) {
		g4Dao.update("AdcShiftPattern.updateAdcShiftPatternDetailItem", pDto);
		return null;
	}

	public Dto deleteAdcShiftPatternDetailItem(Dto pDto) {
		// TODO Auto-generated method stub
		return null;
	}

}
