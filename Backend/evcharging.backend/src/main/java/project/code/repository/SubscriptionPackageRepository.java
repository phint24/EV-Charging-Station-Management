package project.code.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.code.model.SubscriptionPackage;
// (1) IMPORT ENUM MÀ MODEL SỬ DỤNG
import project.code.model.enums.SubscriptionType;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionPackageRepository extends JpaRepository<SubscriptionPackage, String> {

    // Tìm theo tên chính xác (Optional)
    Optional<SubscriptionPackage> findByName(String name);

    // Tìm theo tên chứa từ khóa (không phân biệt hoa thường)
    List<SubscriptionPackage> findByNameContainingIgnoreCase(String keyword);

    // (2) SỬA LỖI: Đổi tham số từ String sang Enum
    List<SubscriptionPackage> findByType(SubscriptionType type);

    // Tìm theo khoảng giá [min, max]
    List<SubscriptionPackage> findByPriceBetween(Double minPrice, Double maxPrice);

    // Tìm các gói có giá >= minPrice
    List<SubscriptionPackage> findByPriceGreaterThanEqual(Double minPrice);

    // Tìm các gói có giá <= maxPrice
    List<SubscriptionPackage> findByPriceLessThanEqual(Double maxPrice);

    // Tìm theo số ngày hiệu lực (durationDays)
    List<SubscriptionPackage> findByDurationDays(int durationDays);

    // Tìm các gói có durationDays >= minDays
    List<SubscriptionPackage> findByDurationDaysGreaterThanEqual(int minDays);

    // Tìm theo mô tả chứa từ khóa
    List<SubscriptionPackage> findByDescriptionContainingIgnoreCase(String keyword);

    // Lấy tất cả sắp xếp theo giá tăng dần
    List<SubscriptionPackage> findAllByOrderByPriceAsc();

    // Lấy tất cả sắp xếp theo giá giảm dần
    List<SubscriptionPackage> findAllByOrderByPriceDesc();

    // Lấy tất cả sắp xếp theo durationDays tăng dần
    List<SubscriptionPackage> findAllByOrderByDurationDaysAsc();

    // (3) SỬA LỖI: Đổi tham số từ String sang Enum
    List<SubscriptionPackage> findByTypeOrderByPriceAsc(SubscriptionType type);
}