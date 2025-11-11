package project.code.dto.wallet;

public record WalletBalanceApiResponse(

        Long driverProfileId,

        String email,

        double oldBalance,

        double amountChanged,

        double newBalance
) {
}