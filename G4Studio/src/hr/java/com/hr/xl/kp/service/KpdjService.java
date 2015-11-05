package com.hr.xl.kp.service;

import org.g4studio.common.service.BaseService;
import org.g4studio.core.metatype.Dto;

public interface KpdjService extends BaseService {

	public Dto saveKpdjItem(Dto pDto);

	public Dto deleteKpdjItem(Dto pDto);

	public Dto updateKpdjItem(Dto pDto);
}
