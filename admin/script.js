// 全局变量
let currentRequestId = null;
let currentActionType = null;
let currentEmailData = null;

// 模拟的申请数据
const requestsData = {
    1: {
        username: 'john_doe',
        email: 'john.doe@example.com',
        applyTime: '2024-01-15 10:30',
        reason: '希望加入贡献蛇形图生成系统，用于个人GitHub档案展示'
    },
    2: {
        username: 'alice_smith',
        email: 'alice.smith@company.com',
        applyTime: '2024-01-16 14:20',
        reason: '作为开源贡献者，希望获得个性化的GitHub贡献图表'
    }
};

// 邮件模板
const emailTemplates = {
    approve: {
        subject: '🎉 您的Assets Repository申请已被批准！',
        body: `
            <h2>恭喜！您的申请已被批准</h2>
            <p>亲爱的 <strong>{{username}}</strong>，</p>
            
            <p>我们很高兴通知您，您申请加入Assets Repository系统的请求已经被批准！</p>
            
            <h3>接下来会发生什么？</h3>
            <ul>
                <li>🔄 您的GitHub贡献蛇形图将在接下来的几小时内开始生成</li>
                <li>📊 系统将每8小时自动更新一次您的贡献图表</li>
                <li>🎨 您将获得浅色和深色两个版本的SVG图表</li>
                <li>🔗 生成的图表将在以下地址可用：
                    <br>• <a href="https://assets.ohto-ai.dev/{{username}}/github-contribution-grid-snake.svg">标准版本</a>
                    <br>• <a href="https://assets.ohto-ai.dev/{{username}}/github-contribution-grid-snake-dark.svg">深色版本</a>
                </li>
            </ul>
            
            <h3>如何使用生成的图表？</h3>
            <p>您可以在GitHub个人资料的README.md中添加以下代码来显示您的贡献图表：</p>
            
            <pre style="background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff;">
![GitHub Contribution Snake](https://assets.ohto-ai.dev/{{username}}/github-contribution-grid-snake.svg)
</pre>
            
            <p>或者使用深色版本：</p>
            
            <pre style="background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff;">
![GitHub Contribution Snake Dark](https://assets.ohto-ai.dev/{{username}}/github-contribution-grid-snake-dark.svg)
</pre>
            
            <h3>需要帮助？</h3>
            <p>如果您有任何问题或需要技术支持，请随时联系我们：</p>
            <ul>
                <li>📧 发送邮件至：<a href="mailto:support@ohto-ai.dev">support@ohto-ai.dev</a></li>
                <li>🐛 在GitHub Issues中报告问题：<a href="https://github.com/Ohto-Ai-Dev/res/issues">GitHub Issues</a></li>
            </ul>
            
            <p>感谢您使用我们的服务！</p>
            
            <hr style="margin: 30px 0; border: 1px solid #e9ecef;">
            <p style="color: #6c757d; font-size: 0.9rem;">
                此邮件由Assets Repository自动发送<br>
                Ohto-Ai Development Team<br>
                <a href="https://github.com/Ohto-Ai-Dev">https://github.com/Ohto-Ai-Dev</a>
            </p>
        `
    },
    reject: {
        subject: '📝 关于您的Assets Repository申请',
        body: `
            <h2>感谢您的申请</h2>
            <p>亲爱的 <strong>{{username}}</strong>，</p>
            
            <p>感谢您申请加入Assets Repository系统。经过仔细审核，我们很遗憾地通知您，您的申请暂时无法被批准。</p>
            
            <h3>原因说明</h3>
            <p>基于以下一个或多个原因，我们无法批准您的申请：</p>
            <ul>
                <li>🔍 GitHub账户活跃度不足</li>
                <li>📊 贡献记录较少或不规律</li>
                <li>⚠️ 账户存在异常活动</li>
                <li>📝 申请信息不完整或不准确</li>
                <li>🚫 违反了我们的使用条款</li>
            </ul>
            
            <h3>如何提高申请成功率？</h3>
            <p>如果您希望重新申请，建议您：</p>
            <ul>
                <li>✅ 保持GitHub账户的活跃度，定期提交代码</li>
                <li>📈 增加开源项目的贡献</li>
                <li>📝 完善您的GitHub个人资料信息</li>
                <li>🤝 积极参与开源社区活动</li>
            </ul>
            
            <h3>重新申请</h3>
            <p>您可以在 <strong>30天后</strong> 重新提交申请。届时请确保您的GitHub账户满足以下条件：</p>
            <ul>
                <li>📅 账户创建时间超过3个月</li>
                <li>🔥 最近6个月有持续的提交活动</li>
                <li>⭐ 至少有一个public repository</li>
                <li>👤 完整的个人资料信息</li>
            </ul>
            
            <h3>其他选择</h3>
            <p>虽然您无法使用我们的服务，但您仍然可以：</p>
            <ul>
                <li>🛠️ 使用GitHub官方的contribution graph</li>
                <li>🔧 自行搭建类似的服务</li>
                <li>🌟 使用其他第三方GitHub统计服务</li>
            </ul>
            
            <h3>需要帮助？</h3>
            <p>如果您对此决定有疑问或需要更多信息，请联系我们：</p>
            <ul>
                <li>📧 发送邮件至：<a href="mailto:support@ohto-ai.dev">support@ohto-ai.dev</a></li>
                <li>💬 在GitHub Discussions中讨论：<a href="https://github.com/Ohto-Ai-Dev/res/discussions">GitHub Discussions</a></li>
            </ul>
            
            <p>再次感谢您的关注和申请！</p>
            
            <hr style="margin: 30px 0; border: 1px solid #e9ecef;">
            <p style="color: #6c757d; font-size: 0.9rem;">
                此邮件由Assets Repository自动发送<br>
                Ohto-Ai Development Team<br>
                <a href="https://github.com/Ohto-Ai-Dev">https://github.com/Ohto-Ai-Dev</a>
            </p>
        `
    }
};

// 显示邮件预览
function showEmailPreview(requestId, actionType) {
    currentRequestId = requestId;
    currentActionType = actionType;
    
    const requestData = requestsData[requestId];
    if (!requestData) {
        alert('未找到申请数据！');
        return;
    }
    
    const template = emailTemplates[actionType];
    if (!template) {
        alert('未找到邮件模板！');
        return;
    }
    
    // 替换模板中的变量
    const emailSubject = template.subject.replace(/{{(\w+)}}/g, (match, key) => {
        return requestData[key] || match;
    });
    
    const emailBody = template.body.replace(/{{(\w+)}}/g, (match, key) => {
        return requestData[key] || match;
    });
    
    // 保存当前邮件数据
    currentEmailData = {
        to: requestData.email,
        subject: emailSubject,
        body: emailBody
    };
    
    // 更新模态窗口内容
    document.getElementById('modalTitle').textContent = actionType === 'approve' ? '批准邮件预览' : '拒绝邮件预览';
    document.getElementById('emailTo').textContent = requestData.email;
    document.getElementById('emailSubject').textContent = emailSubject;
    document.getElementById('emailBody').innerHTML = emailBody;
    
    // 显示模态窗口
    document.getElementById('emailPreviewModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 关闭邮件预览
function closeEmailPreview() {
    document.getElementById('emailPreviewModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    currentRequestId = null;
    currentActionType = null;
    currentEmailData = null;
}

// 发送邮件
function sendEmail() {
    if (!currentEmailData || !currentRequestId) {
        alert('邮件数据不完整！');
        return;
    }
    
    // 模拟发送邮件
    const requestItem = document.querySelector(`[data-request-id="${currentRequestId}"]`);
    if (requestItem) {
        // 添加状态指示器
        const actionType = currentActionType === 'approve' ? '已批准' : '已拒绝';
        const statusClass = currentActionType === 'approve' ? 'status-approved' : 'status-rejected';
        
        // 更新请求项显示
        const requestInfo = requestItem.querySelector('.request-info');
        const existingStatus = requestInfo.querySelector('.status-indicator');
        if (existingStatus) {
            existingStatus.remove();
        }
        
        const statusIndicator = document.createElement('span');
        statusIndicator.className = `status-indicator ${statusClass}`;
        statusIndicator.textContent = actionType;
        requestInfo.appendChild(statusIndicator);
        
        // 禁用按钮
        const buttons = requestItem.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        });
        
        // 添加处理时间
        const timeInfo = document.createElement('p');
        timeInfo.innerHTML = `<strong>处理时间:</strong> ${new Date().toLocaleString('zh-CN')}`;
        requestInfo.appendChild(timeInfo);
    }
    
    // 显示成功消息
    alert(`邮件已成功发送到 ${currentEmailData.to}！\n\n操作类型: ${currentActionType === 'approve' ? '批准' : '拒绝'}\n处理时间: ${new Date().toLocaleString('zh-CN')}`);
    
    // 关闭模态窗口
    closeEmailPreview();
}

// 编辑模板
function editTemplate() {
    if (!currentEmailData) {
        alert('没有可编辑的邮件数据！');
        return;
    }
    
    // 填充编辑表单
    document.getElementById('templateSubject').value = currentEmailData.subject;
    document.getElementById('templateBody').value = currentEmailData.body.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    
    // 显示编辑模态窗口
    document.getElementById('editTemplateModal').style.display = 'block';
}

// 关闭编辑模板
function closeEditTemplate() {
    document.getElementById('editTemplateModal').style.display = 'none';
}

// 保存模板并预览
function saveTemplate() {
    const subject = document.getElementById('templateSubject').value.trim();
    const body = document.getElementById('templateBody').value.trim();
    
    if (!subject || !body) {
        alert('请填写完整的邮件主题和内容！');
        return;
    }
    
    // 更新当前邮件数据
    currentEmailData.subject = subject;
    currentEmailData.body = body.replace(/\n/g, '<br>');
    
    // 更新预览窗口
    document.getElementById('emailSubject').textContent = subject;
    document.getElementById('emailBody').innerHTML = currentEmailData.body;
    
    // 关闭编辑窗口
    closeEditTemplate();
    
    // 显示保存成功消息
    alert('模板已保存并更新预览！');
}

// 点击模态窗口外部关闭
window.onclick = function(event) {
    const emailModal = document.getElementById('emailPreviewModal');
    const editModal = document.getElementById('editTemplateModal');
    
    if (event.target === emailModal) {
        closeEmailPreview();
    }
    
    if (event.target === editModal) {
        closeEditTemplate();
    }
}

// 键盘事件处理
document.addEventListener('keydown', function(event) {
    // ESC键关闭模态窗口
    if (event.key === 'Escape') {
        if (document.getElementById('editTemplateModal').style.display === 'block') {
            closeEditTemplate();
        } else if (document.getElementById('emailPreviewModal').style.display === 'block') {
            closeEmailPreview();
        }
    }
});

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('Assets Repository Admin Panel Loaded');
    
    // 添加一些交互提示
    const requestItems = document.querySelectorAll('.request-item');
    requestItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.borderLeftColor = '#2980b9';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.borderLeftColor = '#3498db';
        });
    });
});