package com.hr.xl.kp.service;

import org.g4studio.common.service.BaseService;
import org.g4studio.core.metatype.Dto;

public interface KpdaService extends BaseService {

	public Dto saveKpdaItem(Dto pDto);

	public Dto deleteKpdaItems(Dto pDto);

	public Dto updateKpdaItem(Dto pDto);
}
