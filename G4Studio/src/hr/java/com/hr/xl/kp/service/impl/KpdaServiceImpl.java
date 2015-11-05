package com.hr.xl.kp.service.impl;

import org.g4studio.common.service.impl.BaseServiceImpl;
import org.g4studio.core.metatype.Dto;
import org.g4studio.core.metatype.impl.BaseDto;
import org.g4studio.core.util.G4Utils;

import com.hr.xl.kp.service.KpdaService;
import com.hr.xl.system.utils.IDHelper;

public class KpdaServiceImpl extends BaseServiceImpl implements KpdaService {

	public Dto saveKpdaItem(Dto pDto) {
		Dto outDao = new BaseDto();
		String daid = IDHelper.getDAID();
		pDto.put("daid", daid);
		g4Dao.insert("KPDA.saveKpdaItem", pDto);
		outDao.put("success", new Boolean(true));
		outDao.put("msg", "考评档案保存成功，档案号[" + daid + "]。");
		return outDao;
	}

	public Dto deleteKpdaItems(Dto pDto) {
		Dto dto = new BaseDto();
		String strCannotDel = null;
		String[] arrChecked = pDto.getAsString("strChecked").split(",");
		for (int i = 0; i < arrChecked.length; i++) {
			dto.put("daid", arrChecked[i]);
			Integer temp = (Integer) g4Dao.queryForObject("KPDA.checkDaExists",
					dto);
			if (temp.intValue() > 0) {
				strCannotDel += "[" + arrChecked[i] + "]";
				continue;
			}
			g4Dao.update("KPDA.deleteKpdaMxItem", dto);
			g4Dao.delete("KPDA.deleteKpdaItem", dto);
		}
		Dto outDto = new BaseDto();
		outDto.put("success", new Boolean(true));
		if (G4Utils.isEmpty(strCannotDel)) {
			outDto.put("msg", "所选档案删除成功！");
		} else {
			outDto.put("msg", "下列档案由于已经使用无法删除：" + strCannotDel);
		}
		return outDto;
	}

	public Dto updateKpdaItem(Dto pDto) {
		g4Dao.update("KPDA.updateKpdaItem", pDto);
		return null;
	}

}
