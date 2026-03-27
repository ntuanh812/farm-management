import NotificationBell from './NotificationBell';

export const Topbar = () => {
    return (
        <div className="topbar">
            <NotificationBell />
            <div className="topbar__user">
                <span className="topbar__user-name">Xin chào, Admin</span>
                <span className="topbar__user-avatar">👤</span>
            </div>
        </div>
    )
}
