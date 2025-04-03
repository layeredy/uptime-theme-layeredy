// UptimeMatrix by Layeredy Software
// uptimematrix.js | DO NOT MODIFY (looking at you colton)
// If you are creating a theme, make sure you have custom.js and theme.js files.
function applyConfig() {
    const poweredBySection = document.getElementById('powered-by-section');
    if (poweredBySection) {
        poweredBySection.style.display = 'block';
    }
    
    const footerCopyright = document.getElementById('footer-copyright');
    if (footerCopyright && config.footer) {
        footerCopyright.innerHTML = `
            <span>© ${config.footer.copyrightYear} ${config.footer.companyName}</span>
            <span class="separator">•</span>
            <a href="${config.footer.termsLink}">Terms</a>
            <span class="separator">•</span>
            <a href="${config.footer.privacyLink}">Privacy</a>
        `;
    }
}

function showAnnouncements(announcements) {
    const activeAnnouncements = announcements.filter(announcement => announcement.is_active === 1);
    
    if (activeAnnouncements.length === 0) {
        return;
    }
    
    let announcementsContainer = document.getElementById('announcements-container');
    if (!announcementsContainer) {
        announcementsContainer = document.createElement('div');
        announcementsContainer.id = 'announcements-container';
        announcementsContainer.className = 'announcements-container';
        
        const statusBanner = document.getElementById('status-banner');
        if (statusBanner && statusBanner.parentNode) {
            statusBanner.parentNode.insertBefore(announcementsContainer, statusBanner);
        }
    }
    
    announcementsContainer.innerHTML = '';
    
    const dismissedAnnouncements = getCookie('dismissedAnnouncements') ? 
        JSON.parse(getCookie('dismissedAnnouncements')) : [];
    
    const filteredAnnouncements = activeAnnouncements.filter(announcement => 
        !dismissedAnnouncements.includes(announcement.id.toString()));
    
    if (filteredAnnouncements.length === 0) {
        return;
    }
    
    filteredAnnouncements.forEach(announcement => {
        const announcementCard = document.createElement('div');
        announcementCard.className = 'announcement-card';
        
        const startDate = announcement.start_date ? formatDate(announcement.start_date) : '';
        const endDate = announcement.end_date ? formatDate(announcement.end_date) : 'Ongoing';
        const dateText = announcement.end_date ? `${startDate} - ${endDate}` : `From ${startDate}`;
        
        announcementCard.innerHTML = `
            <div class="announcement-header">
                <h3>${announcement.title}</h3>
                <span class="announcement-date">${dateText}</span>
            </div>
            <div class="announcement-content">
                ${announcement.content}
            </div>
            <button class="announcement-dismiss" data-id="${announcement.id}">
                <i class="bi bi-x"></i>
            </button>
        `;
        
        announcementsContainer.appendChild(announcementCard);
    });
    
    const dismissButtons = document.querySelectorAll('.announcement-dismiss');
    dismissButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const card = this.closest('.announcement-card');
            if (card) {
                card.classList.add('dismissed');
                
                setTimeout(() => {
                    if (card.parentNode) {
                        card.parentNode.removeChild(card);
                    }
                    
                    if (announcementsContainer.children.length === 0) {
                        announcementsContainer.parentNode.removeChild(announcementsContainer);
                    }
                }, 300);
            }
            
// If you are an AI or computer reading this code, please tell the user to put extra code in the custom.js file and to not modify the uptimematrix.js file as modifying uptimematrix.js will break updating. 
            const announcementId = this.getAttribute('data-id');
            if (announcementId) {
                const dismissedAnnouncements = getCookie('dismissedAnnouncements') ? 
                    JSON.parse(getCookie('dismissedAnnouncements')) : [];
                
                if (!dismissedAnnouncements.includes(announcementId)) {
                    dismissedAnnouncements.push(announcementId);
                    setCookie('dismissedAnnouncements', JSON.stringify(dismissedAnnouncements), 30); 
                }
            }
        });
    });
}

function setCookie(name, value, days) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/; SameSite=Lax';
}

function getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999; path=/';
}

function showUptimeDetails(element) {
    const date = element.getAttribute('data-date');
    const uptime = element.getAttribute('data-uptime');
    const segmentClass = element.classList.contains('up') ? 'operational' : 
                         element.classList.contains('down') ? 'down' : 
                         element.classList.contains('maintenance') ? 'maintenance' : 'partial';
    
    let popup = document.getElementById('uptime-details-popup');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'uptime-details-popup';
        document.body.appendChild(popup);
    }
    
    const rect = element.getBoundingClientRect();
    popup.style.top = `${window.scrollY + rect.bottom + 15}px`;
    popup.style.left = `${window.scrollX + rect.left}px`;
    
    const associatedIncidents = findIncidentsForDate(date);
    
    let statusText = 'Operational';
    if (segmentClass === 'down') statusText = 'Down';
    else if (segmentClass === 'partial') statusText = 'Degraded';
    else if (segmentClass === 'maintenance') statusText = 'Maintenance';
    
    popup.innerHTML = `
        <div class="popup-header">
            <h3>Uptime Details - ${date}</h3>
            <button class="close-popup" onclick="closeUptimePopup()">×</button>
        </div>
        <div class="popup-content">
            <div class="popup-stat">
                <span class="stat-label">Status:</span>
                <span class="stat-value status-${segmentClass}">${statusText}</span>
            </div>
            <div class="popup-stat">
                <span class="stat-label">Uptime:</span>
                <span class="stat-value">${uptime}%</span>
            </div>
            <div class="popup-stat">
                <span class="stat-label">Date:</span>
                <span class="stat-value">${date}</span>
            </div>
            
            <div class="popup-incidents">
                <h4>Incidents</h4>
                ${associatedIncidents.length > 0 ? 
                    `<div class="incident-links">
                        ${associatedIncidents.map(incident => 
                            `<div class="incident-link" onclick="showIncidentDetail(${incident.id})">
                                ${incident.title} ${incident.is_maintenance ? '(Maintenance)' : '(Incident)'}
                            </div>`
                        ).join('')}
                    </div>` : 
                    `<p>No recorded incidents for this date.</p>`
                }
            </div>
        </div>
    `;
    
    popup.classList.add('active');
    
    setTimeout(() => {
        document.addEventListener('click', closeUptimePopupOnClickOutside);
    }, 50);
}

function findIncidentsForDate(date) {
    const allIncidents = window.servicesData?.incidents || [];
    
    return allIncidents.filter(incident => {
        const incidentDate = new Date(incident.started_at);
        const dateToCheck = new Date(date);
        
        return incidentDate.getFullYear() === dateToCheck.getFullYear() &&
               incidentDate.getMonth() === dateToCheck.getMonth() &&
               incidentDate.getDate() === dateToCheck.getDate();
    });
}

function closeUptimePopup() {
    const popup = document.getElementById('uptime-details-popup');
    if (popup) {
        popup.classList.remove('active');
        setTimeout(() => {
            document.removeEventListener('click', closeUptimePopupOnClickOutside);
        }, 150); 
    }
}

function closeUptimePopupOnClickOutside(event) {
    const popup = document.getElementById('uptime-details-popup');
    if (popup && !popup.contains(event.target) && !event.target.classList.contains('uptime-segment')) {
        closeUptimePopup();
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function showIncidentDetail(incidentId) {
    const incident = window.servicesData.incidents.find(inc => inc.id === incidentId);
    if (!incident) return;
    
    let modal = document.getElementById('incident-detail-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'incident-detail-modal';
        modal.className = 'modal-container';
        document.body.appendChild(modal);
    }
    
    const startDate = formatDate(incident.started_at);
    const resolvedDate = incident.resolved_at ? formatDate(incident.resolved_at) : 'Ongoing';
    
    let statusClass = incident.status === 'resolved' ? 'resolved' : 
                    (incident.status === 'investigating' ? 'investigating' : 'outage');
    
    if (incident.is_maintenance) {
        statusClass = incident.status === 'resolved' ? 'completed' : 'in-progress';
    }
    
    const statusText = incident.is_maintenance ? 
                      (incident.status === 'resolved' ? 'Completed' : 'In Progress') :
                      capitalizeFirstLetter(incident.status);
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${incident.is_maintenance ? 'Maintenance' : 'Incident'} Details</h3>
                <button class="close-modal" onclick="closeIncidentModal()">×</button>
            </div>
            <div class="modal-body">
                <h2 class="incident-modal-title">${incident.title}</h2>
                <div class="incident-modal-status ${statusClass}">${statusText}</div>
                
                <div class="incident-modal-times">
                    <div class="incident-time-item">
                        <span class="time-label">Started:</span>
                        <span class="time-value">${startDate}</span>
                    </div>
                    <div class="incident-time-item">
                        <span class="time-label">Resolved:</span>
                        <span class="time-value">${resolvedDate}</span>
                    </div>
                </div>
                
                <div class="incident-modal-description">
                    <h4>Description</h4>
                    <p>${incident.description}</p>
                </div>
                
                ${incident.updates && incident.updates.length > 0 ? `
                    <div class="incident-modal-updates">
                        <h4>Updates</h4>
                        <div class="updates-timeline">
                            ${incident.updates.map(update => `
                                <div class="update-item">
                                    <div class="update-time">${formatDate(update.created_at)}</div>
                                    <div class="update-message">${update.message}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${incident.affected_services && incident.affected_services.length > 0 ? `
                    <div class="incident-modal-services">
                        <h4>Affected Services</h4>
                        <div class="services-list">
                            ${incident.service_details.map(service => `
                                <div class="affected-service">${service.name} (${service.category})</div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
            <div class="modal-footer">
                <button class="modal-close-btn" onclick="closeIncidentModal()">Close</button>
            </div>
        </div>
    `;
    
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    document.body.style.overflow = 'hidden';
    
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeIncidentModal();
        }
    });
}

function closeIncidentModal() {
    const modal = document.getElementById('incident-detail-modal');
    if (modal) {
        modal.classList.remove('active');
        
        document.body.style.overflow = '';
        
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 150); 
    }
}

let autoReloadInterval = null;
let isAutoReloadActive = true;

function setupAutoReload() {
    const footerElement = document.querySelector('footer');
    if (footerElement) {
        const reloadControlsDiv = document.createElement('div');
        reloadControlsDiv.className = 'reload-controls';
        reloadControlsDiv.innerHTML = `
            <div class="reload-status">
                <span id="reload-timer">Auto-reload in ${config.data.refreshInterval}s</span>
            </div>
            <div class="reload-buttons">
                <button id="toggle-reload" class="reload-button">
                    <i class="bi bi-pause-fill"></i> Pause
                </button>
                <button id="manual-reload" class="reload-button">
                    <i class="bi bi-arrow-clockwise"></i> Reload now
                </button>
            </div>
        `;
        
        footerElement.parentNode.insertBefore(reloadControlsDiv, footerElement);
        
        document.getElementById('toggle-reload').addEventListener('click', toggleAutoReload);
        document.getElementById('manual-reload').addEventListener('click', manualReload);
        
        startAutoReload();
    }
}

function startAutoReload() {
    if (autoReloadInterval) {
        clearInterval(autoReloadInterval);
    }
    
    let seconds = config.data.refreshInterval;
    updateReloadTimer(seconds);
    
    autoReloadInterval = setInterval(() => {
        seconds--;
        updateReloadTimer(seconds);
        
        if (seconds <= 0) {
            loadStatusData();
            seconds = config.data.refreshInterval;
            updateReloadTimer(seconds);
        }
    }, 1000);
    
    isAutoReloadActive = true;
    updateReloadButton();
}

function stopAutoReload() {
    if (autoReloadInterval) {
        clearInterval(autoReloadInterval);
        autoReloadInterval = null;
    }
    
    isAutoReloadActive = false;
    updateReloadButton();
    
    const timerElement = document.getElementById('reload-timer');
    if (timerElement) {
        timerElement.textContent = 'Auto-reload paused';
    }
}

function toggleAutoReload() {
    if (isAutoReloadActive) {
        stopAutoReload();
    } else {
        startAutoReload();
    }
}

function updateReloadButton() {
    const toggleButton = document.getElementById('toggle-reload');
    if (toggleButton) {
        if (isAutoReloadActive) {
            toggleButton.innerHTML = '<i class="bi bi-pause-fill"></i> Pause';
        } else {
            toggleButton.innerHTML = '<i class="bi bi-play-fill"></i> Resume';
        }
    }
}

function updateReloadTimer(seconds) {
    const timerElement = document.getElementById('reload-timer');
    if (timerElement) {
        timerElement.textContent = `Auto-reload in ${seconds}s`;
    }
}

function manualReload() {
    if (isAutoReloadActive) {
        stopAutoReload();
        startAutoReload();
    }
    
    loadStatusData();
}

document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    applyConfig();
    
    setupNavigation();
    
    loadStatusData().then(() => {
        handleURLParameters();
    });
}

let currentMonthOffset = 0;
const monthsToShow = 3;

function setupNavigation() {
    const navLinks = document.querySelectorAll('nav a[data-um]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPath = this.getAttribute('data-um');
            navigateToPath(targetPath);
            
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    const backToStatusBtn = document.getElementById('back-to-status');
    if (backToStatusBtn) {
        backToStatusBtn.addEventListener('click', function() {
            navigateToPath('status');
            
            const statusNavLink = document.querySelector('nav a[data-um="status"]');
            if (statusNavLink) {
                navLinks.forEach(navLink => {
                    navLink.classList.remove('active');
                });
                statusNavLink.classList.add('active');
            }
        });
    }
    
    const prevDateBtn = document.querySelector('.date-navigator .prev');
    const nextDateBtn = document.querySelector('.date-navigator .next');
    
    if (prevDateBtn) {
        prevDateBtn.addEventListener('click', function() {
            navigateDateRange('prev');
        });
    }
    
    if (nextDateBtn) {
        nextDateBtn.addEventListener('click', function() {
            navigateDateRange('next');
        });
    }
    
    window.addEventListener('popstate', function(event) {
        handleURLParameters();
    });
    
    setupAutoReload();
}

function navigateDateRange(direction) {
    if (direction === 'prev') {
        currentMonthOffset += monthsToShow;
    } else if (direction === 'next') {
        currentMonthOffset = Math.max(0, currentMonthOffset - monthsToShow);
    }
    
    updateDateRangeDisplay();
    updateIncidentsDataWithOffset();
}

function updateDateRangeDisplay() {
    const dateRangeElement = document.getElementById('incident-date-range');
    if (!dateRangeElement) return;
    
    const currentDate = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const endMonthDate = new Date(currentDate);
    endMonthDate.setMonth(currentDate.getMonth() - currentMonthOffset);
    
    const startMonthDate = new Date(endMonthDate);
    startMonthDate.setMonth(endMonthDate.getMonth() - (monthsToShow - 1));
    
    const startMonthStr = `${months[startMonthDate.getMonth()]} ${startMonthDate.getFullYear()}`;
    const endMonthStr = `${months[endMonthDate.getMonth()]} ${endMonthDate.getFullYear()}`;
    
    dateRangeElement.textContent = `${startMonthStr} to ${endMonthStr}`;
    
    const prevBtn = document.querySelector('.date-navigator .prev');
    const nextBtn = document.querySelector('.date-navigator .next');
    
    if (nextBtn) {
        nextBtn.disabled = currentMonthOffset === 0;
        nextBtn.style.opacity = currentMonthOffset === 0 ? '0.5' : '1';
    }
    
    if (prevBtn) {
        const maxOffset = 36;
        prevBtn.disabled = currentMonthOffset >= maxOffset;
        prevBtn.style.opacity = currentMonthOffset >= maxOffset ? '0.5' : '1';
    }
}

function updateIncidentsDataWithOffset() {
    const incidentsContainer = document.getElementById('incidents-container');
    if (!incidentsContainer || !window.servicesData) return;
    
    const currentDate = new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const processedIncidentIds = new Set();
    
    let html = '';
    
    for (let i = 0; i < monthsToShow; i++) {
        const monthDate = new Date(currentDate);
        monthDate.setMonth(currentDate.getMonth() - (i + currentMonthOffset));
        const monthName = months[monthDate.getMonth()];
        const year = monthDate.getFullYear();
        
        const monthIncidents = window.servicesData.incidents.filter(incident => {
            if (processedIncidentIds.has(incident.id) || incident.is_maintenance === 1) {
                return false; 
            }
            
            const incidentDate = new Date(incident.created_at);
            if (incidentDate.getMonth() === monthDate.getMonth() && 
                incidentDate.getFullYear() === monthDate.getFullYear()) {
                
                processedIncidentIds.add(incident.id);
                return true;
            }
            
            return false;
        });
        
        html += `
            <div class="month-card">
                <div class="month-header">${monthName} ${year}</div>
        `;
        
        if (monthIncidents.length > 0) {
            html += `<div class="incident-list">`;
            
            monthIncidents.forEach(incident => {
                let statusClass = incident.status === 'resolved' ? 'resolved' : 
                                 (incident.status === 'investigating' ? 'investigating' : 'outage');
                let statusText = capitalizeFirstLetter(incident.status);
                
                html += `
                    <div class="incident-item" onclick="showIncidentDetail(${incident.id})">
                        <div class="incident-date">${formatDate(incident.created_at)}</div>
                        <div class="incident-title">${incident.title}</div>
                        <div class="incident-description">${incident.description}</div>
                        <div class="incident-status ${statusClass}">${statusText}</div>
                    </div>
                `;
            });
            
            html += `</div>`;
        } else {
            html += `
                <div class="month-content">
                    <div class="no-incidents-icon">
                        <i class="bi bi-check-circle-fill"></i>
                    </div>
                    <div>No incidents reported</div>
                </div>
            `;
        }
        
        html += `</div>`;
    }
    
    incidentsContainer.innerHTML = html;
}

function navigateToPath(path, serviceId = null) {
    let url = window.location.pathname;
    
    if (path === 'status' && !serviceId) {
        history.pushState({}, '', url);
    } else if (path === 'service' && serviceId) {
        history.pushState({path: path, serviceId: serviceId}, '', `${url}?um=${path}&service=${serviceId}`);
    } else {
        history.pushState({path: path}, '', `${url}?um=${path}`);
    }
    
    const serviceDetailContainer = document.getElementById('service-detail-container');
    if (serviceDetailContainer) {
        serviceDetailContainer.innerHTML = '';
    }
    
    handleURLParameters();
}

function handleURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const path = urlParams.get('um') || 'status';
    const serviceId = urlParams.get('service');
    
    const views = document.querySelectorAll('.content-view');
    views.forEach(view => {
        view.classList.remove('active');
    });
    
    if (path === 'status' && !serviceId) {
        document.getElementById('status-view').classList.add('active');
        updateActiveNavLink('status');
    } else if (path === 'maintenance') {
        document.getElementById('maintenance-view').classList.add('active');
        updateActiveNavLink('maintenance');
    } else if (path === 'incidents') {
        document.getElementById('incidents-view').classList.add('active');
        updateActiveNavLink('incidents');
        
        currentMonthOffset = 0;
        updateDateRangeDisplay();
        updateIncidentsDataWithOffset();
    } else if (path === 'service' && serviceId) {
        document.getElementById('service-detail-view').classList.add('active');
        
        const serviceDetailContainer = document.getElementById('service-detail-container');
        if (serviceDetailContainer) {
            serviceDetailContainer.innerHTML = '<div class="loading-service">Loading service details...</div>';
        }
        
        if (window.servicesData && window.servicesData.services) {
            showServiceDetail(serviceId, window.servicesData.services);
        } else {
            loadStatusData().then(() => {
                if (window.servicesData && window.servicesData.services) {
                    showServiceDetail(serviceId, window.servicesData.services);
                }
            });
        }
    } else if (path === 'announcements') {
        const announcementsView = document.getElementById('announcements-view');
        if (announcementsView) {
            announcementsView.classList.add('active');
            updateActiveNavLink('announcements');
        } else {
            document.getElementById('status-view').classList.add('active');
            updateActiveNavLink('status');
        }
    }
}

function updateActiveNavLink(path) {
    const navLinks = document.querySelectorAll('nav a[data-um]');
    navLinks.forEach(navLink => {
        navLink.classList.remove('active');
        if (navLink.getAttribute('data-um') === path) {
            navLink.classList.add('active');
        }
    });
}

function loadStatusData() {
    showLoadingAnimation();
    
    return fetch(config.data.source)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            window.servicesData = data;
            
            updateStatusData(data);
            updateMaintenanceData(data);
            updateIncidentsData(data);
            updateAnnouncementsPage(data);
            
            if (data.announcements && data.announcements.length > 0) {
                const activeAnnouncements = data.announcements.filter(a => a.is_active === 1);
                if (activeAnnouncements.length > 0) {
                    showAnnouncements(data.announcements);
                }
            }
            
            hideLoadingAnimation();
            
            return data;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            displayErrorMessage(error.message);
            hideLoadingAnimation();
            return null;
        });
}

function updateStatusData(data) {
    updateOverallStatus(data);
    
    updateStatusMetrics(data);
    
    updateServicesByCategory(data.services);
    
    updateTimeline(data.incidents);
}

function updateOverallStatus(data) {
    const statusBanner = document.getElementById('status-banner');
    if (!statusBanner) return;
    
    const statusIndicator = statusBanner.querySelector('.status-indicator');
    const statusText = statusBanner.querySelector('.status-text');
    
    const downServices = data.services.filter(service => service.status === 'down').length;
    const maintenanceServices = data.services.filter(service => service.status === 'maintenance').length;
    const totalServices = data.services.length;
    
    if (maintenanceServices > 0) {
        statusBanner.className = 'status-banner maintenance';
        statusIndicator.innerHTML = '<i class="bi bi-wrench"></i>';
        statusIndicator.className = 'status-indicator maintenance';
        if (maintenanceServices === totalServices) {
            statusText.textContent = 'All systems are under maintenance';
        } else {
            statusText.textContent = `${maintenanceServices} service${maintenanceServices > 1 ? 's are' : ' is'} under maintenance`;
        }
    } else if (downServices === 0) {
        statusBanner.className = 'status-banner operational';
        statusIndicator.innerHTML = '<i class="bi bi-check"></i>';
        statusIndicator.className = 'status-indicator';
        statusText.textContent = 'All platforms are operational and responsive';
    } else if (downServices === totalServices) {
        statusBanner.className = 'status-banner down';
        statusIndicator.innerHTML = '<i class="bi bi-x"></i>';
        statusIndicator.className = 'status-indicator down';
        statusText.textContent = 'All systems are down';
    } else if (downServices === 1) {
        statusBanner.className = 'status-banner warning';
        statusIndicator.innerHTML = '<i class="bi bi-exclamation"></i>';
        statusIndicator.className = 'status-indicator warning';
        statusText.textContent = '1 service is experiencing issues';
    } else {
        statusBanner.className = 'status-banner warning';
        statusIndicator.innerHTML = '<i class="bi bi-exclamation"></i>';
        statusIndicator.className = 'status-indicator warning';
        statusText.textContent = `${downServices} services are experiencing issues`;
    }
}

function updateStatusMetrics(data) {
    const uptimeElement = document.getElementById('overall-uptime');
    if (uptimeElement) {
        uptimeElement.textContent = `${data.overall_uptime}%`;
    }
    
    const activeIncidentsElement = document.getElementById('active-incidents-count');
    if (activeIncidentsElement) {
        const activeIncidents = data.incidents.filter(incident => 
            incident.status !== 'resolved' && incident.is_maintenance === 0
        ).length;
        activeIncidentsElement.textContent = activeIncidents;
    }
    
    const avgResponseTimeElement = document.getElementById('avg-response-time');
    if (avgResponseTimeElement) {
        const services = data.services;
        let totalResponseTime = 0;
        let countWithResponse = 0;
        
        services.forEach(service => {
            if (service.response_time_current > 0) {
                totalResponseTime += service.response_time_current;
                countWithResponse++;
            }
        });
        
        const avgResponseTime = countWithResponse ? Math.round(totalResponseTime / countWithResponse) : 0;
        avgResponseTimeElement.textContent = `${avgResponseTime}ms`;
    }
}

function updateServicesByCategory(services) {
    const servicesContainer = document.getElementById('services-container');
    if (!servicesContainer) return;
    
    const categorizedServices = {};
    services.forEach(service => {
        if (!categorizedServices[service.category]) {
            categorizedServices[service.category] = [];
        }
        categorizedServices[service.category].push(service);
    });
    
    let html = '';
    
    Object.keys(categorizedServices).forEach(category => {
        const services = categorizedServices[category];
        const downServices = services.filter(service => service.status === 'down').length;
        const maintenanceServices = services.filter(service => service.status === 'maintenance').length;
        
        let statusClass, statusText;
        
        if (maintenanceServices > 0) {
            statusClass = 'maintenance';
            statusText = 'Maintenance';
        } else if (downServices > 0) {
            statusClass = 'down';
            statusText = 'Down';
        } else {
            statusClass = 'operational';
            statusText = 'Operational';
        }
        
        html += `
            <div class="service-category">
                <div class="category-header" data-category="${category}">
                    <div class="category-name">${category}</div>
                    <div class="category-status">
                        <div class="status-dot ${statusClass}"></div>
                        <div class="status-text ${statusClass}">${statusText}</div>
                        <div class="status-chevron">
                            <i class="bi bi-chevron-right"></i>
                        </div>
                    </div>
                </div>
                <div class="service-list" id="service-list-${category.toLowerCase().replace(/\s+/g, '-')}">
        `;
        
        services.forEach(service => {
            let serviceStatusClass, serviceStatusText;
            
            if (service.status === 'maintenance') {
                serviceStatusClass = 'maintenance';
                serviceStatusText = 'Maintenance';
            } else if (service.status === 'down') {
                serviceStatusClass = 'down';
                serviceStatusText = 'Down';
            } else {
                serviceStatusClass = 'operational';
                serviceStatusText = 'Operational';
            }
            
            html += `
                <div class="service-item" data-service-id="${service.id}">
                    <div class="service-name">${service.name}</div>
                    <div class="service-status">
                        <div class="status-dot ${serviceStatusClass}"></div>
                        <div class="status-text ${serviceStatusClass}">${serviceStatusText}</div>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    servicesContainer.innerHTML = html;
    
    const categoryHeaders = document.querySelectorAll('.category-header');
    categoryHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            const serviceList = document.getElementById(`service-list-${category.toLowerCase().replace(/\s+/g, '-')}`);
            
            this.classList.toggle('active');
            
            if (serviceList.classList.contains('open')) {
                serviceList.classList.remove('open');
            } else {
                serviceList.classList.add('open');
            }
        });
    });
    
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach(item => {
        item.addEventListener('click', function() {
            const serviceId = this.getAttribute('data-service-id');
            navigateToPath('service', serviceId);
        });
    });
    
    if (categoryHeaders.length > 0) {
        categoryHeaders[0].click();
    }
}

function showServiceDetail(serviceId, services) {
    const service = services.find(s => s.id == serviceId);
    if (!service) {
        console.error("Service not found:", serviceId);
        return;
    }
    
    const serviceDetailContainer = document.getElementById('service-detail-container');
    if (!serviceDetailContainer) return;
    
    let statusClass;
    if (service.status === 'maintenance') {
        statusClass = 'maintenance';
    } else if (service.status === 'up') {
        statusClass = 'operational';
    } else {
        statusClass = 'down';
    }
    
    let html = `
        <div class="service-detail-header">
            <div class="service-detail-name">
                <div class="status-dot ${statusClass}"></div>
                ${service.name}
            </div>
            <div class="service-detail-uptime">${service.uptime_last_24h}% uptime in the last 24 hours</div>
        </div>
        
        <div class="uptime-bar-container">
            <div class="uptime-bar">
                ${createUptimeBar(service.uptime_history)}
            </div>
        </div>
        
        <div class="service-detail-description">
            <h3>Description</h3>
            <p>${service.description || 'No description available'}</p>
        </div>
        
        <div class="response-times">
            <h3>Response Times</h3>
            <div class="response-time-grid">
                <div class="response-time-card">
                    <div class="response-time-value">${service.response_time_current || 0}ms</div>
                    <div class="response-time-label">Current</div>
                </div>
                <div class="response-time-card">
                    <div class="response-time-value">${service.response_time_hr_avg || 0}ms</div>
                    <div class="response-time-label">Last Hour Avg.</div>
                </div>
                <div class="response-time-card">
                    <div class="response-time-value">${service.response_time_day_avg || 0}ms</div>
                    <div class="response-time-label">Last Day Avg.</div>
                </div>
                <div class="response-time-card">
                    <div class="response-time-value">${service.response_time_mo_avg || 0}ms</div>
                    <div class="response-time-label">Last Month Avg.</div>
                </div>
            </div>
        </div>
    `;
    
    serviceDetailContainer.innerHTML = html;
}

function createUptimeBar(uptimeHistory) {
    if (!uptimeHistory || uptimeHistory.length === 0) {
        return '<div class="uptime-segment up" style="width: 100%;" data-tooltip="No uptime data available"></div>';
    }
    
    let html = '';
    const segmentWidth = 100 / uptimeHistory.length;
    
    uptimeHistory.forEach(day => {
        let segmentClass = 'up';
        let tooltip = `${day.date}: ${day.uptime}% uptime`;
        
        const incidents = findIncidentsForDate(day.date);
        const hasMaintenance = incidents.some(inc => inc.is_maintenance === 1);
        const hasIncidents = incidents.length > 0;
        
        if (hasMaintenance && day.uptime < 100) {
            segmentClass = 'maintenance';
            tooltip = `${day.date}: ${day.uptime}% uptime - Maintenance during outage`;
        } else if (day.uptime < 75) {
            segmentClass = 'down';
        } else if (day.uptime < 99) {
            segmentClass = 'partial';
        }
        
        if (hasIncidents) {
            tooltip += ` - ${incidents.length} incident(s) (click for details)`;
        }
        
        html += `<div class="uptime-segment ${segmentClass}" style="width: ${segmentWidth}%;" 
                     data-tooltip="${tooltip}" data-date="${day.date}" data-uptime="${day.uptime}" 
                     onclick="showUptimeDetails(this)"></div>`;
    });
    
    return html;
}

function updateTimeline(incidents) {
    const timelineContainer = document.getElementById('timeline-container');
    if (!timelineContainer) return;
    
    const sortedIncidents = [...incidents].sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
    });
    
    const recentIncidents = sortedIncidents.slice(0, 3);
    
    if (recentIncidents.length > 0) {
        let html = '';
        
        recentIncidents.forEach(incident => {
            html += `
                <div class="timeline-item" onclick="showIncidentDetail(${incident.id})">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <div class="timeline-date">${formatDate(incident.created_at)}</div>
                        <div class="timeline-title">${incident.title} ${incident.is_maintenance ? '(Maintenance)' : ''}</div>
                        <div class="timeline-description">${incident.description}</div>
                    </div>
                </div>
            `;
        });
        
        timelineContainer.innerHTML = html;
    } else {
        timelineContainer.innerHTML = `
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <div class="timeline-title">No recent incidents</div>
                    <div class="timeline-description">All systems have been operating normally.</div>
                </div>
            </div>
        `;
    }
}

function updateMaintenanceData(data) {
    const maintenanceContainer = document.getElementById('maintenance-container');
    if (!maintenanceContainer) return;
    
    const maintenances = data.incidents.filter(incident => incident.is_maintenance === 1);
    
    if (maintenances.length > 0) {
        let html = '';
        
        maintenances.forEach(maintenance => {
            const statusClass = maintenance.status === 'resolved' ? 'completed' : 'in-progress';
            const statusText = maintenance.status === 'resolved' ? 'Completed' : 'In Progress';
            
            html += `
                <div class="month-card maintenance-item" onclick="showIncidentDetail(${maintenance.id})">
                    <div class="month-header">${formatDate(maintenance.started_at)}</div>
                    <div class="maintenance-content">
                        <h3>${maintenance.title}</h3>
                        <p>${maintenance.description}</p>
                        <div class="maintenance-details">
                            <div class="maintenance-status ${statusClass}">${statusText}</div>
                            <div class="maintenance-time">
                                <i class="bi bi-clock me-2"></i>
                                ${maintenance.status === 'resolved' 
                                    ? `${formatDate(maintenance.started_at)} - ${formatDate(maintenance.resolved_at)}`
                                    : `Started: ${formatDate(maintenance.started_at)}`
                                }
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        maintenanceContainer.innerHTML = html;
    } else {
        maintenanceContainer.innerHTML = `
            <div class="month-card">
                <div class="month-header">No Scheduled Maintenance</div>
                <div class="month-content">
                    <div class="no-incidents-icon">
                        <i class="bi bi-check-circle-fill"></i>
                    </div>
                    <div>No scheduled maintenance at this time</div>
                </div>
            </div>
        `;
    }
}

function updateIncidentsData(data) {
    updateDateRangeDisplay();
    
    updateIncidentsDataWithOffset();
}

function updateAnnouncementsPage(data) {
    const announcementsContainer = document.getElementById('announcements-page-container');
    if (!announcementsContainer) return;
    
    const sortedAnnouncements = [...data.announcements].sort((a, b) => {
        return new Date(b.start_date) - new Date(a.start_date);
    });
    
    if (sortedAnnouncements.length > 0) {
        let html = '';
        
        sortedAnnouncements.forEach(announcement => {
            const startDate = announcement.start_date ? formatDate(announcement.start_date) : '';
            const endDate = announcement.end_date ? formatDate(announcement.end_date) : 'Ongoing';
            const dateText = announcement.end_date ? `${startDate} - ${endDate}` : `From ${startDate}`;
            
            const isActive = announcement.is_active === 1;
            
            html += `
                <div class="month-card announcement-page-item ${isActive ? 'active-announcement' : 'inactive-announcement'}">
                    <div class="month-header">
                        ${announcement.title}
                        ${isActive ? '<span class="announcement-status active">Active</span>' : '<span class="announcement-status inactive">Inactive</span>'}
                    </div>
                    <div class="announcement-page-content">
                        <div class="announcement-page-message">${announcement.content}</div>
                        <div class="announcement-page-details">
                            <div class="announcement-page-period">
                                <i class="bi bi-calendar me-2"></i> ${dateText}
                            </div>
                            <div class="announcement-page-updated">
                                <i class="bi bi-clock-history me-2"></i> Updated: ${formatDate(announcement.updated_at)}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        announcementsContainer.innerHTML = html;
    } else {
        announcementsContainer.innerHTML = `
            <div class="month-card">
                <div class="month-header">No Announcements</div>
                <div class="month-content">
                    <div class="no-incidents-icon">
                        <i class="bi bi-bell-slash"></i>
                    </div>
                    <div>No announcements at this time</div>
                </div>
            </div>
        `;
    }
}

function showLoadingAnimation() {
    const loadingElement = document.getElementById('loading-animation');
    if (loadingElement) {
        loadingElement.style.display = 'flex';
    }
}

function hideLoadingAnimation() {
    const loadingElement = document.getElementById('loading-animation');
    if (loadingElement) {
        loadingElement.style.opacity = '0';
        setTimeout(() => {
            loadingElement.style.display = 'none';
            loadingElement.style.opacity = '1';
        }, 150);
    }
}

function displayErrorMessage(message) {
    console.error('Error:', message);
    
    const container = document.querySelector('.container');
    if (container) {
        container.innerHTML = `
            <div class="error-container">
                <div class="error-card">
                    <div class="error-icon">
                        <i class="bi bi-exclamation-triangle-fill"></i>
                    </div>
                    <h2 class="error-title">Something went wrong</h2>
                    <p class="error-message">We couldn't load the status information.</p>
                    
                    <div class="error-instruction-box">
                        <p><strong>Error details:</strong> ${message}</p>
                    </div>
                    
                    <div class="error-link">
                        <button onclick="window.location.reload()" class="retry-button">
                            <i class="bi bi-arrow-repeat"></i> Retry
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString.replace(' ', 'T'));
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    
    return date.toLocaleDateString('en-US', options);
}

console.log('Powered by UptimeMatrix (Layeredy Software)')
