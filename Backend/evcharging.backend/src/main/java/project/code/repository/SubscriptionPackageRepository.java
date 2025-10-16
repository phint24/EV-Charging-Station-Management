package project.code.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.code.model.SubscriptionPackage;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionPackageRepository extends JpaRepository<SubscriptionPackage, String> {

    // Tìm theo tên chính xác (Optional như AdminRepository)
    Optional<SubscriptionPackage> findByName(String name);

    // Tìm theo tên chứa từ khóa (không phân biệt hoa thường)
    List<SubscriptionPackage> findByNameContainingIgnoreCase(String keyword);

    // Tìm theo loại gói (ví dụ: "monthly", "annual", "payg")
    List<SubscriptionPackage> findByType(String type);

    // Tìm theo khoảng giá [min, max]
    List<SubscriptionPackage> findByPriceBetween(Double minPrice, Double maxPrice);

    // Tìm các gói có giá >= minPrice
    List<SubscriptionPackage> findByPriceGreaterThanEqual(Double minPrice);
}

