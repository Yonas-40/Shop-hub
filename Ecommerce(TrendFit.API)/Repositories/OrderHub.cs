using Microsoft.AspNetCore.SignalR;

namespace Ecommerce_TrendFit.API_.Repositories;

public class OrderHub : Hub
{
    public async Task JoinUserGroup(string userId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, userId);
        Console.WriteLine($"Client {Context.ConnectionId} joined group {userId}");
    }

    // Example of a client leaving a group
    public async Task LeaveUserGroup(string userId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, userId);
        Console.WriteLine($"Client {Context.ConnectionId} left group {userId}");
    }
}
