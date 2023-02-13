package com.yzw.ibuild.commerce.portal.controller.basic;

import com.yzw.ibuild.base.dto.DtoResult;
import com.yzw.ibuild.commerce.business.module.basic.service.CmcBasicMeteringCycleConfigService;
import com.yzw.ibuild.commerce.business.module.basic.vo.MeteringCycleConfigVo;
import com.yzw.ibuild.commons.starter.annotion.EventLog;
import com.yzw.ibuild.sso.core.response.LoginUser;
import com.yzw.ibuild.sso.core.util.AuthUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

@Validated
@RestController
@RequestMapping("/api/commerce/basic/config")
@Api(tags = "Basic", description = "基础设置")
public class BasicConfigController {
    @Autowired
    private CmcBasicMeteringCycleConfigService configService;

    @ApiOperation(value = "设置计量周期")
    @PostMapping("/meteringCycle")
    @EventLog(operationName = "商务模块.基础设置.配置计量周期", businessSysNoSpEL = "#data.tenantSysNo")
    public DtoResult configMeteringCycle(@RequestBody @Valid @NotNull(message = "请提供计量周期的设置") MeteringCycleConfigVo data) {
        LoginUser loginUser = AuthUtil.getAuthUser();
        data.setTenantSysNo(loginUser.getTenantSysNo());
        configService.updateMeteringCycleConfig(data, loginUser);
        return DtoResult.ok(null);
    }

    @ApiOperation(value = "获取计量周期设置")
    @GetMapping("/meteringCycle")
    public DtoResult<MeteringCycleConfigVo> getMeteringCycleConfig() {
        LoginUser loginUser = AuthUtil.getAuthUser();
        MeteringCycleConfigVo config = configService.getLatestMeteringCycleConfig(loginUser.getTenantSysNo());
        return DtoResult.ok(config);
    }

    @ApiOperation(value = "获取计量周期配置记录")
    @GetMapping("/listMeteringCycleConfigs")
    public DtoResult<List<MeteringCycleConfigVo>> listMeteringCycleConfigs() {
        LoginUser loginUser = AuthUtil.getAuthUser();
        return DtoResult.ok(configService.listMeteringCycleConfigs(loginUser.getTenantSysNo()));
    }
}
